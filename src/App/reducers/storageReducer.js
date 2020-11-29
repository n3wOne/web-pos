import { message } from "antd";
import { DATA_KEY, INVOICES_KEY, storageConstants } from "../Constants";
import { getDateString, notify, storageToJSON, storageToMap } from "../utils";

const {
  SET_DATA,
  REMOVE_INVOICE,
  REMOVE_ITEM,
  SAVE_EDIT_DATA,
  SET_STORAGE_DATA,
  SET_STORAGE_DATA_FAILED,
  SET_LOCAL_STORAGE,
  SET_REMOTE_STORAGE,
  CHANGE_ORDER,
} = storageConstants;

const initialState = {
  storage: new Map([]),
  remoteStorage: new Map([]),
  data: [],
  errors: [],
};

const storeData = (state, data) => {
  if (!localStorage.getItem(INVOICES_KEY)) {
    localStorage.setItem(INVOICES_KEY, JSON.stringify([]));
  }
  const storage = storageToMap(localStorage.getItem(INVOICES_KEY));
  if (!data) {
    return { ...state, storage };
  }
  try {
    [...data.keys()].forEach((key) => {
      if (!storage.has(key)) {
        storage.set(key, data.get(key));
      }
    });
    localStorage.setItem(INVOICES_KEY, storageToJSON(storage));
  } catch (e) {
    notify({
      type: "error",
      description: `${e}`,
    });
  }
  return {
    ...state,
    storage,
  };
};

const removeInvoice = (state, id, fetchUrl) => {
  const storage = storageToMap(localStorage.getItem(INVOICES_KEY));
  storage.delete(id);
  localStorage.setItem(INVOICES_KEY, storageToJSON(storage));

  try {
    const fetchParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    };
    fetch(`${fetchUrl}/delete_invoice.php`, fetchParams)
      .then((res) => res.json())
      .then((resp) => {
        let alertData = resp;
        if (Array.isArray(alertData)) {
          alertData = Object.fromEntries(alertData);
        }
        if (alertData.status) {
          notify({
            type: "success",
            message: "Удаление заказа",
            description: `Заказ ${getDateString(id)} удален`,
          });
        } else {
          notify({
            type: "info",
            message: "Что-то пошло не так",
            description: `=(`,
          });
        }
      })
      .catch((e) =>
        notify({
          type: "error",
          description: `${e}`,
        })
      );
  } catch (e) {
    notify({
      type: "error",
      description: `${e}`,
    });
  }

  return { ...state, storage };
};

const removeItem = (state, id, fetchUrl) => {
  const storage = JSON.parse(localStorage.getItem(DATA_KEY));
  const filtered = storage.filter((item) => item && item.id && item.id !== id);
  localStorage.setItem(DATA_KEY, JSON.stringify(filtered));
  try {
    const fetchParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    };
    fetch(`${fetchUrl}/delete_item.php`, fetchParams)
      .then((res) => res.json())
      .then((resp) => {
        if (resp.success) {
          message.success("Элемент успешно удален!");
        }
        if (resp.error) {
          message.error(`Ошибка удаления: ${resp.error}`);
        }
      });
  } catch (e) {
    notify({
      type: "error",
      description: e,
    });
  }

  return {
    ...state,
    data: filtered,
  };
};

const setData = (state, payload) => {
  const data = JSON.parse(payload).map((item) => ({
    ...item,
    id: +item.id,
    price: +item.price,
  }));
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
  return { ...state, data };
};

const changeOrder = (state, payload) => {
  localStorage.setItem(DATA_KEY, JSON.stringify(payload));
  return { ...state, data: payload };
};

export function StorageReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_ORDER:
      return changeOrder(state, action.payload);
    case REMOVE_INVOICE:
      return removeInvoice(state, action.payload.id, action.payload.fetchUrl);
    case REMOVE_ITEM:
      return removeItem(state, action.payload.id, action.fetchUrl);
    case SET_DATA:
      return setData(state, action.payload);
    case SAVE_EDIT_DATA:
      return { ...state, data: action.payload };
    case SET_STORAGE_DATA:
      return { ...state, data: action.payload };
    case SET_STORAGE_DATA_FAILED:
      return { ...state, errors: [...action.payload] };
    case SET_LOCAL_STORAGE:
      return storeData(state, action.payload);
    case SET_REMOTE_STORAGE:
      return {
        ...state,
        remoteStorage: new Map(
          action.payload.map(([key, value]) => [+key, value.data])
        ),
      };
    default:
      return { ...state };
  }
}

import {
  put,
  all,
  call,
  select,
  takeLatest,
} from "redux-saga/effects";
import data from "../store/data";
import {
  LOAD_CONFIG,
  LOAD_CONFIG_SUCCESS,
  LOAD_DEFAULT_CONFIG,
  SET_CONFIG,
} from "./configReducer";

export const SAVE_EDIT = "SAVE_EDIT";
export const LOAD_DATA_FROM_STORAGE_START = "LOAD_DATA_FROM_STORAGE_START";

const getNewData = async (state, action) => {
  const newItem = action.payload;
  const stateData = [...state.data].filter((item) => item !== null);
  const editItem = stateData.find((item) => +item.id === +newItem.id);

  let newData;
  if (editItem) {
    newData = [
      ...stateData.map((i) =>
        i && i.id !== null && +i.id === +newItem.id ? newItem : i
      ),
    ];
  } else {
    stateData.push(newItem);
    newData = [...stateData];
  }
  try {
    localStorage.setItem("@data", JSON.stringify(newData));
  } catch (e) {
    console.log("Save error", e);
  }
  return newData;
};

export function* saveEdit(action) {
  const state = yield select();
  try {
    const newData = yield getNewData(state.storage, action);
    yield put({ type: "SAVE_EDIT_DATA", payload: newData });
  } catch (e) {
    console.log("SOME ERROR!", e);
  }
}

const readLocalStorage = async () => {
  try {
    const storageData = localStorage.getItem("@data");
    // const storageData = {};
    if (!storageData) {
      try {
        await localStorage.setItem("@data", JSON.stringify(data));
        return readLocalStorage();
      } catch (e) {
        console.log("Storage error: ", e);
      }
    }
    return storageData;
  } catch (e) {
    console.log("cant read storage keys");
  }
};

export function* loadDataFromStore() {
  try {
    const storageData = yield call(readLocalStorage);
    yield put({ type: "SET_STORAGE_DATA", payload: JSON.parse(storageData) });
  } catch (error) {
    yield put({ type: "SET_STORAGE_DATA_FAILED", error });
  }
}

function* setConfig(action) {
  try {
    yield localStorage.setItem("@config", JSON.stringify(action.payload));
    yield put({ type: "SAVE_CONFIG_SUCCESS", payload: action.payload });
  } catch (e) {
    console.error("Save config failed", e);
    yield put({ type: "SAVE_CONFIG_FAILED", e });
  }
}

function* loadConfig() {
  try {
    const storageData = localStorage.getItem("@config");
    if (!storageData) {
      yield put({
        type: LOAD_DEFAULT_CONFIG,
      });
      return loadConfig();
    }
    yield put({
      type: LOAD_CONFIG_SUCCESS,
      payload: JSON.parse(storageData),
    });
  } catch (e) {
    console.error("Failed to load config", e);
    yield put({ type: "LOAD_CONFIG_ERROR", e });
  }
}

export function* watchSaveConfig() {
  yield takeLatest(SET_CONFIG, setConfig);
}

export function* watchLoadConfigFromStorage() {
  yield takeLatest(LOAD_CONFIG, loadConfig);
}

export function* watchSaveData() {
  yield takeLatest(SAVE_EDIT, saveEdit);
}

export function* watchLoadDataFromStorage() {
  yield takeLatest(LOAD_DATA_FROM_STORAGE_START, loadDataFromStore);
}

export function* watchLoadDefaultConfig() {
  yield takeLatest(LOAD_DEFAULT_CONFIG, loadConfig);
}

export default function* rootSaga() {
  yield all([
    watchLoadDataFromStorage(),
    watchSaveData(),
    watchSaveConfig(),
    watchLoadConfigFromStorage(),
    watchLoadDefaultConfig(),
  ]);
}

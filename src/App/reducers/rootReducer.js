// import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";
import { dnow, notify } from "../utils";
import { INVOICES_KEY } from "../Constants";

export const LOAD_PRODUCT_LIST_SUCCESS = "LOAD_PRODUCT_LIST_SUCCESS";
export const FILTER_ITEMS = "FILTER_ITEMS";
export const LOAD_PRODUCT_DETAILS = "LOAD_PRODUCT_DETAILS";
export const LOAD_PRODUCT_DETAILS_SUCCESS = "LOAD_PRODUCT_DETAILS_SUCCESS";
export const LOAD_PRODUCT_LIST = "LOAD_PRODUCT_LIST";
export const CLEAR_CART = "CLEAR_CART";
export const ADD_TO_CART_ITEM = "ADD_TO_CART_ITEM";
export const REMOVE_ITEM_FROM_CART = "REMOVE_ITEM_FROM_CART";
export const SET_CART_ITEM_COUNT = "SET_CART_ITEM_COUNT";
export const LOAD_CATEGORIES = "LOAD_CATEGORIES";
export const LOAD_CATEGORIES_SUCCESS = "LOAD_CATEGORIES_SUCCESS";
export const INVOICE = "INVOICE";
export const SET_CART_ITEM = "SET_CART_ITEM";

const invoices = {
  invoices: new Map([]),
};

const initialState = {
  editItem: {},
  showModal: false,
  localStorageData: [],
  cartTotal: 0,
  cartItems: new Map([]),
  products: [],
  productsList: new Map([]),
  categories: [],
  filterList: [],
  isLoading: true,
  productIsLoading: true,
  categoriesIsLoading: true,
  ...invoices,
};

const getCartTotal = (cart) =>
  [...cart.cartItems.values()].reduce(
    (total, product) => +total + +product.price * +product.count,
    0
  );

const newCartState = (state) => ({
  ...state,
  cartItems: state.cartItems,
  cartTotal: getCartTotal(state).toFixed(),
});

const addToCart = (state, payload) => {
  const newCartItems = new Map([...state.cartItems]).set(payload.id, {
    ...payload,
    count: 1,
  });

  return {
    ...state,
    cartItems: newCartItems,
  };
};

const removeProductFromCart = (state, payload) => {
  state.cartItems.delete(payload);
  return { ...state };
};

const setCartItem = (state, payload) => {
  const newCartItems = new Map([...state.cartItems]).set(payload.id, {
    ...payload,
  });
  return {
    ...state,
    cartItems: newCartItems,
  };
};

const setCartItemCount = (state, payload) => {
  const newCartItems = new Map([...state.cartItems]).set(payload.id, {
    ...payload,
    count: payload.count,
  });
  if (payload.count > 0) {
    return {
      ...state,
      cartItems: newCartItems,
    };
  }
  state.cartItems.delete(payload.id);
  return {
    ...state,
    cartItems: new Map([...state.cartItems]),
  };

  // state.cartItems.delete(payload.id);
  // return {...state};
};

const sendInvoiceRemote = async ({ date, payload }, fetchUrl) => {
  try {
    const fetchParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date: `${date}`, items: payload }),
    };
    await fetch(`${fetchUrl}/createInvoice.php`, fetchParams)
      .then((res) => res.json())
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
};

const storeData = () => async (date, payload, connected, fetchUrl) => {
  try {
    if (!localStorage.getItem("@invoices")) {
      localStorage.setItem(INVOICES_KEY, JSON.stringify([]));
    }
    const storage = JSON.parse(localStorage.getItem("@invoices"));
    const item = [date, payload];
    storage.push(item);
    localStorage.setItem(INVOICES_KEY, JSON.stringify(storage));
    await sendInvoiceRemote({ date, payload }, fetchUrl);
  } catch (e) {
    notify({
      type: "error",
      description: `${e}`,
    });
    console.log("saving error");
  }
};

const loadProduct = (state, id) => {
  return { ...state, product: state.productsList.get(id) };
};

const productsToMap = (products) => {
  const productsList = new Map([]);
  products.forEach((product) => productsList.set(product.id, product));
  return productsList;
};

export function CartReducer(state = initialState, action) {
  switch (action.type) {
    case INVOICE:
      const date = dnow(moment());
      storeData()(date, action.payload, action.connected, action.fetchUrl);
      invoices.invoices.set(date, action.payload);
      return { ...state };
    case ADD_TO_CART_ITEM:
      return newCartState(addToCart(state, action.payload));
    case REMOVE_ITEM_FROM_CART:
      return newCartState(removeProductFromCart(state, action.payload));
    case SET_CART_ITEM:
      return newCartState(setCartItem(state, action.payload));
    case SET_CART_ITEM_COUNT:
      return newCartState(setCartItemCount(state, action.payload));
    case CLEAR_CART:
      return initialState;
    case LOAD_PRODUCT_LIST:
      return { ...state, productIsLoading: true };
    case LOAD_PRODUCT_LIST_SUCCESS:
      return {
        ...state,
        products: action.payload,
        productsList: productsToMap(action.payload),
        productIsLoading: false,
      };
    case LOAD_CATEGORIES:
      return { ...state, categoriesIsLoading: true };
    case LOAD_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.payload,
        categoriesIsLoading: false,
      };
    case FILTER_ITEMS:
      return { ...state, filterList: action.payload };
    case LOAD_PRODUCT_DETAILS:
      return loadProduct(state, action.payload);
    case LOAD_PRODUCT_DETAILS_SUCCESS:
      return { ...state, product: action.payload, isLoading: false };
    default:
      return state;
  }
}

// export function ProductReducer(state = initialState, action) {
//   switch (action.type) {
//     // case LOAD_PRODUCT_LIST:
//     //   return {...state, productIsLoading: true};
//     // case LOAD_PRODUCT_LIST_SUCCESS:
//     //   return {
//     //     ...state,
//     //     products: action.payload,
//     //     productsList: productsToMap(action.payload),
//     //     productIsLoading: false,
//     //   };
//     // case LOAD_CATEGORIES:
//     //   return {...state, categoriesIsLoading: true};
//     // case LOAD_CATEGORIES_SUCCESS:
//     //   return {
//     //     ...state,
//     //     categories: action.payload,
//     //     categoriesIsLoading: false,
//     //   };
//     // case FILTER_ITEMS:
//     //   return {...state, filterList: action.payload};
//     // case LOAD_PRODUCT_DETAILS:
//     //   return loadProduct(state, action.payload);
//     // case LOAD_PRODUCT_DETAILS_SUCCESS:
//     //   return {...state, product: action.payload, isLoading: false};
//     default:
//       return state;
//   }
// }

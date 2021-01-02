import { connect } from "react-redux";
import {
  REMOVE_ITEM_FROM_CART,
  SET_CART_ITEM_COUNT,
  CLEAR_CART,
  ADD_TO_CART_ITEM,
  INVOICE,
  SET_CART_ITEM,
} from "../reducers/rootReducer";
import { storageConstants } from "../Constants";
import { LOAD_DATA_FROM_STORAGE_START } from "../reducers/sagas";

const mapStateToProps = (state) => {
  const { cart, storage, config } = state;
  return {
    ...storage,
    config,
    isLoading: cart.productIsLoading,
    categoriesIsLoading: cart.categoriesIsLoading,
    cart,
    productsList: cart.productsList,
    cartTotal: cart.cartTotal,
    cartItems: cart.cartItems,
  };
};

const mapDatePickerProps = (state) => {
  return { ...state.date };
};

const mapConfigStateToProps = (state) => {
  const { config } = state;
  return { ...config };
};

const saveEdit = (payload) => ({
  type: "SAVE_EDIT",
  payload,
});

export const removeItem = (payload, fetchUrl) => ({
  type: "REMOVE_ITEM",
  payload,
  fetchUrl,
});

export const loadDataFromStore = () => ({
  type: LOAD_DATA_FROM_STORAGE_START,
});

export const setLocalStorage = (payload) => ({
  type: storageConstants.SET_LOCAL_STORAGE,
  payload,
});

export const setRemoteStorage = (payload) => ({
  type: storageConstants.SET_REMOTE_STORAGE,
  payload,
});

export const removeProductFromCart = (payload) => ({
  type: REMOVE_ITEM_FROM_CART,
  payload,
});

export const setCartItemCount = (payload) => ({
  type: SET_CART_ITEM_COUNT,
  payload,
});

export const setCartItem = (payload) => ({
  type: SET_CART_ITEM,
  payload,
});

export const addProductToCart = (payload) => ({
  type: ADD_TO_CART_ITEM,
  payload,
});

export const clearCart = () => ({ type: CLEAR_CART });

export const removeInvoice = (payload) => ({
  type: storageConstants.REMOVE_INVOICE,
  payload,
});

export const newInvoice = (payload, connected, fetchUrl) => ({
  type: INVOICE,
  payload,
  connected,
  fetchUrl,
});

export const setData = (payload) => ({
  type: storageConstants.SET_DATA,
  payload,
});

export const changeOrder = (payload) => ({
  type: storageConstants.CHANGE_ORDER,
  payload,
});

const mapDispatchToProps = (dispatch) => ({
  changeOrder: (payload) => dispatch(changeOrder(payload)),
  setData: (payload) => dispatch(setData(payload)),
  removeInvoice: (payload) => dispatch(removeInvoice(payload)),
  removeItem: (payload, fetchUrl) => dispatch(removeItem(payload, fetchUrl)),
  saveEdit: (payload) => dispatch(saveEdit(payload)),
  loadDataFromStore: () => dispatch(loadDataFromStore()),
  setLocalStorage: (payload) => dispatch(setLocalStorage(payload)),
  setRemoteStorage: (payload) => dispatch(setRemoteStorage(payload)),
  newInvoice: (payload, connected, fetchUrl) =>
    dispatch(newInvoice(payload, connected, fetchUrl)),
  removeProductFromCart: (payload) => dispatch(removeProductFromCart(payload)),
  setCartItemCount: (payload) => dispatch(setCartItemCount(payload)),
  setCartItem: (payload) => dispatch(setCartItem(payload)),
  addProductToCart: (payload) => dispatch(addProductToCart(payload)),
  clearCart: () => dispatch(clearCart()),
  setConfig: (payload) => dispatch({ type: "SET_CONFIG", payload }),
  loadConfig: () => dispatch({ type: "LOAD_CONFIG" }),
});

const mapConfigDispatchToProps = (dispatch) => ({
  setConfig: (payload) => dispatch({ type: "SET_CONFIG", payload }),
  loadConfig: () => dispatch({ type: "LOAD_CONFIG" }),
});

const mapDatePickerDispatch = (dispatch) => ({
  setStartDate: (payload) => dispatch({ type: "SET_START_DATE", payload }),
  setEndDate: (payload) => dispatch({ type: "SET_END_DATE", payload }),
});

export const connectToStore = (WrappedComponent) =>
  connect(
    (state) => mapStateToProps(state),
    mapDispatchToProps
  )(WrappedComponent);

export const connectDatePickerToStore = (WrappedComponent) =>
  connect(
    (state) => mapDatePickerProps(state),
    mapDatePickerDispatch
  )(WrappedComponent);

export const connectConfigToStore = (WrappedComponent) =>
  connect(
    (state) => mapConfigStateToProps(state),
    mapConfigDispatchToProps
  )(WrappedComponent);

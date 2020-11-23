import { CONFIG_KEY } from "../Constants";

const initialState = {
  fetchUrl: "http://vk.ferma-ivanovka.ru/api",
  // fetchUrl: "http://192.168.0.101",
  numColumns: 3,
  totalBlock: false,
  errors: [],
};

export function ConfigReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_FETCH_URL":
      return { ...state, fetchUrl: action.payload };
    case "LOAD_DEFAULT_CONFIG":
      localStorage.setItem(CONFIG_KEY, JSON.stringify(initialState));
      return { state };
    case "SET_NUM_COLUMNS":
      return { ...state, numColumns: action.payload };
    case "SAVE_CONFIG_FAILED":
      return { ...state, errors: [...state.errors, action.payload] };
    case "SAVE_CONFIG_SUCCESS":
      return { ...state, ...action.payload };
    case "LOAD_CONFIG_SUCCESS":
      return { ...state, ...action.payload };
    case "LOAD_CONFIG_ERROR":
      return { ...state, errors: [...state.errors, action.payload] };
    default:
      return { ...state };
  }
}

// Imports: Dependencies
import { combineReducers } from "redux";
// Imports: Reducers
import { connectRouter } from "connected-react-router";
import { CartReducer } from "./rootReducer";
import { StorageReducer } from "./storageReducer";
import { ConfigReducer } from "./configReducer";
import { DatePickerReducer } from "./datePickerReducer";

const rootReducer = (history) =>
  combineReducers({
    date: DatePickerReducer,
    storage: StorageReducer,
    cart: CartReducer,
    config: ConfigReducer,
    router: connectRouter(history),
  });
// Exports
export default rootReducer;

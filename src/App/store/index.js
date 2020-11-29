// Imports: Dependencies
import createSagaMiddleware from "redux-saga";
import { createStore, applyMiddleware, compose } from "redux";
import { createBrowserHistory } from "history";
import logger from "redux-logger";
import { routerMiddleware } from "connected-react-router";
import rootSaga from "../reducers/sagas";
import rootReducer from "../reducers";

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();
const middlewares = [
  routerMiddleware(history),
  // logger,
  sagaMiddleware,
];

const composedEnhancers = compose(applyMiddleware(...middlewares));

const store = createStore(rootReducer(history), composedEnhancers);
sagaMiddleware.run(rootSaga);
export { store };

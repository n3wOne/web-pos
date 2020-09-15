import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import * as React from "react";
import { store, history } from "./store";
import RootComponent from "./RootComponents";
import "./styles/style.css";
import "./styles/main.scss";
import "antd/dist/antd.css";

function App() {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <RootComponent />
      </ConnectedRouter>
    </Provider>
  );
}

export default App;

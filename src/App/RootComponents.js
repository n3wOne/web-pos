import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { connectToStore } from "./store/ConnectHolder";
import HomeScreen from "./screens/HomeScreen";
import Invoice from "./components/home-screen-components/Invoice";
import StatisticScreen from "./screens/StatisticScreen";
import SettingsScreen from "./screens/SettingsScreen";
import EditStorageData from "./screens/StorageDataScreen";
import BottomNavigation from "./components/BottomNavigation";
import EditItem from "./components/EditItem";
import { INVOICES_KEY } from "./Constants";
import { storageToJSON, storageToMap } from "./utils";

function Routes() {
  return (
    <Switch>
      <Route path={"/edit-item/:id"} component={EditItem} />
      <Route exact path={"/edit-item"} component={EditItem} />
      <Route exact path={"/"}>
        <HomeScreen />
      </Route>
      <Route exact path={"/statistics"}>
        <StatisticScreen />
      </Route>
      <Route exact path={"/editstorage"}>
        <EditStorageData />
      </Route>
      <Route exact path={"/settings"}>
        <SettingsScreen />
      </Route>
    </Switch>
  );
}

// const FETCH_URL = 'http://192.168.0.102';

class RootComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connection: {},
    };
  }

  readLocalStorage = async () => {
    if (!localStorage.getItem("@invoices")) {
      localStorage.setItem(INVOICES_KEY, JSON.stringify([]));
    }
    const storageLocal = storageToMap(localStorage.getItem(INVOICES_KEY));
    try {
      await this.readRemoteStorage();
    } catch (e) {
      alert(`Не удалось загрузить данные с удаленного сервера. ${e}`);
    }
    const { remoteStorage } = this.props;
    const mergedData = [...storageLocal, ...remoteStorage];
    const mergedStorageData = new Map(mergedData);
    try {
      if (mergedStorageData.size > 0) {
        this.props.setLocalStorage(mergedStorageData);
      }
    } catch (e) {
      console.log("cant read storage keys");
    }
  };

  readRemoteStorage = async () => {
    try {
      const fetchParams = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };
      await fetch(
        `${this.props.config.fetchUrl}/getRemoteStorage.php`,
        fetchParams
      )
        .then((res) => res.json())
        .then((resp) => {
          const response = resp.map(([key, value]) => [+key, value]);
          this.props.setRemoteStorage(resp);
        })
        .catch((e) => console.log("Error fetching remote storage", e));
    } catch (e) {
      console.log("Error", e);
    }
  };

  async componentDidMount() {
    this.props.loadDataFromStore();
    await this.props.loadConfig();
    await this.readLocalStorage();
  }

  render() {
    const {
      config: { totalBlock },
    } = this.props;
    // console.log(this.props.config);
    return (
      <div className={"root"}>
        <div className={"content"}>
          <Routes />
        </div>
        <div className={"footer"}>
          <BottomNavigation />
          {!totalBlock && <Invoice />}
        </div>
      </div>
    );
  }
}

export default connectToStore(RootComponent);

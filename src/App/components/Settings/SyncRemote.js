import * as React from "react";
import { connectToStore } from "../../store/ConnectHolder";
// import AsyncStorage from "@react-native-community/async-storage";

class SyncRemote extends React.Component {
  constructor(props) {
    super(props);
  }

  readLocalStorage = async () => {
    let keys = [];
    try {
      // keys = await AsyncStorage.getAllKeys();
      keys = "";
      const filtered = keys.filter((item) => item.match(/\d+/));
      // const storageData = await AsyncStorage.multiGet(filtered);
      const storageData = {};
      this.props.setLocalStorage(storageData);
      // console.log(storageData);
    } catch (e) {
      console.log("cant read storage keys");
    }
  };

  readRemoteStorage = async () => {
    const { fetchUrl } = this.props.config;
    try {
      const fetchParams = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };
      await fetch(`${fetchUrl}/getRemoteStorage.php`, fetchParams)
        .then((res) => res.json())
        .then((resp) => this.props.setRemoteStorage(resp))
        .catch((e) => console.log("Error fetching remote storage", e));
    } catch (e) {
      console.log("Error", e);
    }
  };

  mergeData = async () => {
    try {
      const { storage, remoteStorage } = this.props;
      const localStorageKeys = [...storage.keys()];
      const stringifiedRemoteStorage = [...remoteStorage]
        .filter(([itemKey]) => !localStorageKeys.includes(itemKey))
        .map(([key, value]) => [key, JSON.stringify(value)]);
      // await AsyncStorage.multiMerge(stringifiedRemoteStorage);
      // await AsyncStorage.multiMerge(stringifiedRemoteStorage);
      console.log("Merge Successful");
    } catch (e) {
      console.log("Failed to merge storage", e);
    }
  };

  render() {
    return (
      <>
        <div style={styles.button} onPress={() => this.readLocalStorage()}>
          <div>Получить данные из локального хранилища</div>
        </div>
        <div style={styles.button} onClick={() => this.readRemoteStorage()}>
          <div>Получить данные из удаленного хранилища</div>
        </div>
        <div style={styles.button} onClick={() => this.mergeData()}>
          <div>Синхронизировать локальное и удаленное хранилища</div>
        </div>
      </>
    );
  }
}
const styles = {
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    width: 300,
    marginTop: 16,
  },
};

export default connectToStore(SyncRemote);

import React from "react";
import { Button, Popconfirm, message } from "antd";
import Config from "./Config";
import { clearStorage, notify } from "../../utils";
import { connectToStore } from "../../store/ConnectHolder";
import { DATA_KEY } from "../../Constants";

const GetAllProductsButton = (props) => {
  const { onClick } = props;

  const confirm = () => {
    try {
      onClick();
    } catch (e) {
      message.error(e);
    }
  };

  const cancel = () => {
    message.error("Отмена");
  };

  return (
    <Popconfirm
      title="Внимание! Выполнение данной операции, перезапишет весь список продуктов в локальном хранилище! Продолжить?"
      onConfirm={confirm}
      onCancel={cancel}
      okText="Да"
      cancelText="Нет"
    >
      <Button className={"settings-screen-button"}>
        Получить список продуктов из базы
      </Button>
    </Popconfirm>
  );
};

class Settings extends React.Component {
  async fetchAllProducts() {
    const products = localStorage.getItem(DATA_KEY);
    try {
      const fetchParams = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: products,
      };
      await fetch(
        `${this.props.config.fetchUrl}/sync_products.php`,
        fetchParams
      )
        .then((res) => res.json())
        .then((resp) => {
          if (resp.status === "success") {
            message.success("Синхронизация выполнена успешно!");
          }
        })
        // .then((resp) => this.props.setRemoteStorage(resp))
        .catch((e) =>
          notify({
            type: "error",
            description: `Во время выполнения запроса произошла ошибка! ${e}`,
          })
        );
    } catch (e) {
      notify({
        type: "error",
        description: `Во время выполнения запроса произошла ошибка! ${e}`,
      });
    }
  }

  getAllProducts = async () => {
    const {
      setData,
      config: { fetchUrl },
    } = this.props;
    const fetchParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "getAll" }),
    };
    try {
      await fetch(`${fetchUrl}/sync_products.php`, fetchParams)
        .then((res) => res.text())
        .then((resp) => setData(resp))
        .then(() => message.success("Список продуктов успешно получен!"))
        .catch((e) =>
          notify({
            type: "error",
            description: `Во время выполнения запроса произошла ошибка! ${e}`,
          })
        );
    } catch (e) {
      notify({
        type: "error",
        description: `Во время выполнения запроса произошла ошибка! ${e}`,
      });
    }
  };

  render() {
    return (
      <div className={"settings-screen-wrapper"}>
        <div style={{ marginTop: 10, fontSize: 25 }}>Настройки</div>
        <Config />
        <div
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Button
            className={"settings-screen-button"}
            onClick={() => clearStorage()}
          >
            Очистить хранилище
          </Button>
          <Button
            className={"settings-screen-button"}
            onClick={() => this.fetchQuery()}
          >
            Синхронизировать заказы
          </Button>
          <Button
            className={"settings-screen-button"}
            onClick={() => this.fetchAllProducts()}
          >
            Синхронизировать список продуктов
          </Button>
          <GetAllProductsButton onClick={this.getAllProducts} />
        </div>
      </div>
    );
  }
}
export default connectToStore(Settings);

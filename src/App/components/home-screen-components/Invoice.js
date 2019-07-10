import * as React from "react";
import { connectToStore } from "../../store/ConnectHolder";
import { notify } from "../../utils";
import {Button } from "antd";

class Invoice extends React.Component {
  async createInvoice() {
    const {
      cart: { cartItems },
    } = this.props;
    if (![...cartItems.values()].length > 0) {
      return;
    }
    const obj = [...cartItems.values()].map(({ name, price, count }) => {
      return {
        name,
        count,
        total: (price * count).toFixed(),
        price,
      };
    });
    const connected = true;
    this.props.newInvoice(obj, connected, this.props.config.fetchUrl);
    notify({
      type: "success",
      message: "Заказ создан",
      description: `Заказ на сумму ${this.props.cart.cartTotal} успешно создан`,
    });
    this.props.clearCart();
    try {
      this.props.setLocalStorage();
    } catch (e) {
      notify({
        type: "error",
        description: `Невозможно сохранить. ${e}`,
      });
    }
  }

  render() {
    return (
      <div className={"invoice-buttons"}>
        <Button
          className={"button-clear-cart"}
          onClick={() => this.props.clearCart()}
        >
          {"Очистить корзину"}
        </Button>
        <Button
            type="primary"
          className={"button-create-invoice"}
          onClick={() => this.createInvoice()}
        ><span className={"create-invoice-text"}>{`Создать заказ (${this.props.cart.cartTotal})`}</span></Button>
      </div>
    );
  }
}

export default connectToStore(Invoice);

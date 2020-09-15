import * as React from "react";
import { connectToStore } from "../../store/ConnectHolder";
import { notify } from "../../utils";

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
        <button
          className={"button-clear-cart"}
          onClick={() => this.props.clearCart()}
        >
          {"Очистить корзину"}
        </button>
        <button
          className={"button-create-invoice"}
          onClick={() => this.createInvoice()}
        >{`Создать заказ (${this.props.cart.cartTotal})`}</button>
      </div>
    );
  }
}

export default connectToStore(Invoice);

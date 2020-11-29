import React, { useState } from "react";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Invoice from "./Invoice";

const Row = ({ item, removeProductFromCart }) => {
  const { name, id, price, count } = item;
  const removeItem = () => removeProductFromCart(id);

  return (
    <div className={"total-row"}>
      <div className={"total-row-name"}>{name}</div>
      <div className={"total-row-price"}>
        {price} х {count}
      </div>
      <div className={"total-row-total"}>{price * count}</div>
      <Button
        className={"total-row-remove"}
        onClick={removeItem}
        type="primary"
        icon={<DeleteOutlined />}
      />
    </div>
  );
};

const TotalForm = ({ removeProductFromCart, cartItems, cartTotal }) => {
  return (
    <div className={"total-block"}>
      Итог: <br />
      {cartItems.size > 0 &&
        [...cartItems.values()].map((i) => (
          <Row
            key={i.id}
            item={i}
            removeProductFromCart={removeProductFromCart}
          />
        ))}
      <div className={"total"}>Общая сумма: {cartTotal}</div>
      <div style={{ margin: "20px" }}>
        <Invoice />
      </div>
    </div>
  );
};

export default TotalForm;

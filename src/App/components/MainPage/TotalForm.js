import React, { useState } from "react";
import { Button, Modal as AntModal, Input, Divider } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Calculator from "awesome-react-calculator";
import Invoice from "./Invoice";
import "./styles.module.scss";

const Modal = ({ item, isModalVisible, handleOk, handleCancel }) => {
  const [value, setValue] = useState(item.price);

  const handleChange = ({ target }) => {
    setValue(target.value);
  };

  const onOk = () => {
    handleOk({ ...item, price: value });
  };

  const resultChange = ({ result }) => {
    setValue(result);
  };

  return (
    <AntModal
      title={item.name}
      visible={isModalVisible}
      onOk={onOk}
      onCancel={handleCancel}
    >
      <p>Введите цену: </p>
      <Input onChange={handleChange} value={value} />
      <div className={"calc"}>
        <Calculator onResultChange={resultChange} />
      </div>
    </AntModal>
  );
};

const Row = ({ item, removeProductFromCart, setCartItem }) => {
  const { name, id, price, count } = item;
  const removeItem = () => removeProductFromCart(id);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = (value) => {
    setIsModalVisible(false);
    setCartItem(value);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className={"total-row"}>
      <Modal
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        item={item}
      />
      <div className={"total-row-name"}>{name}</div>
      <div className={"total-row-price"}>
        {price} х {count}
      </div>
      <div className={"total-row-total"}>{price * count}</div>
      <Button onClick={showModal} icon={<EditOutlined />} />
      <Divider type={"vertical"} />
      <Button
        className={"total-row-remove"}
        onClick={removeItem}
        type="primary"
        icon={<DeleteOutlined />}
      />
    </div>
  );
};

const TotalForm = ({
  removeProductFromCart,
  cartItems,
  cartTotal,
  setCartItem,
}) => {
  return (
    <div className={"total-block"}>
      Итог: <br />
      {cartItems.size > 0 &&
        [...cartItems.values()].map((i) => (
          <Row
            key={i.id}
            item={i}
            setCartItem={setCartItem}
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

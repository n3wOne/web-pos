import React, { useState } from "react";
import {
  Input,
  InputNumber,
  Button,
  Tooltip,
  notification,
  message,
} from "antd";
import {
  CloseOutlined,
  CheckOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { connectToStore } from "../store/ConnectHolder";

const EditItem = (props) => {
  const { newId } = props.location.state;
  const propsItem = (props.location.state && props.location.state.item) || null;
  const initialState = propsItem || {
    id: "" || newId,
    name: "",
    description: "",
    price: "",
    imgUrl: null,
  };

  const [item, setItem] = useState(initialState);
  const { saveEdit, removeItem } = props;
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    setItem({ ...item, [name]: name === "price" ? +value : value });
  };
  const save = () => {
    saveEdit(item);
    props.history.push(`/editstorage`);
    notification.success({
      message: "Редактирование продукта",
      description: `"${item.name}" сохранен`,
      duration: 3,
      placement: "bottomRight",
      bottom: 100,
    });
  };
  const cancel = () => {
    props.history.push(`/editstorage`);
  };

  const deleteItem = () => {
    const {
      config: { fetchUrl },
    } = props;
    const conf = window.confirm(`Вы уверены, что хотите удалить ${item.name}?`);
    if (conf) {
      removeItem(item, fetchUrl);
      props.history.push(`/editstorage`);
    }
  };
  return (
    <div className={"edit-item-wrapper"}>
      <Input
        autoComplete={false}
        disabled={!!newId}
        placeholder={"id"}
        className={"edit-item-input"}
        key={"id"}
        value={item.id || newId}
        name={"id"}
        onChange={onChange}
      />
      <Input
        autoComplete={false}
        placeholder={"Название"}
        className={"edit-item-input"}
        key={"name"}
        value={item.name}
        name={"name"}
        onChange={onChange}
      />
      <Input
        autoComplete={false}
        placeholder={"Цена"}
        type={"number"}
        className={"edit-item-input"}
        key={"price"}
        value={item.price}
        name={"price"}
        onChange={onChange}
      />
      <Input
        placeholder={"Описание"}
        className={"edit-item-input"}
        key={"description"}
        value={item.description}
        name={"description"}
        onChange={onChange}
      />
      <div className={"edit-item-buttons"}>
        <Button onClick={cancel} type="primary" danger icon={<CloseOutlined />}>
          Отменить
        </Button>
        <Button onClick={save} type="primary" icon={<CheckOutlined />}>
          Сохранить
        </Button>
      </div>
      <Button onClick={deleteItem} type="primary" icon={<DeleteOutlined />}>
        Удалить
      </Button>
    </div>
  );
};

export default connectToStore(EditItem);

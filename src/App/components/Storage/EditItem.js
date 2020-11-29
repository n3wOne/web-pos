import React, { useState } from "react";
import { Input, Button, notification, Upload } from "antd";
import {
  CloseOutlined,
  CheckOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Resizer from "react-image-file-resizer";
import { connectToStore } from "../../store/ConnectHolder";
// import Uploader from "./Uploader";

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

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        80,
        0,
        (uri) => {
          resolve(uri);
        },
        "blob"
      );
    }).then((res) => setItem({ ...item, url: res }));
  // .then((res) => console.log(res));

  const uploaderProps = {
    action: "http://localhost/upload.php",
    listType: "picture",
    transformFile(file) {
      return resizeFile(file);
    },
  };

  const Uploader = () => {
    return (
      <>
        <Upload {...uploaderProps}>
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </>
    );
  };

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
        disabled={!!newId}
        placeholder={"id"}
        className={"edit-item-input"}
        key={"id"}
        value={item.id || newId}
        name={"id"}
        onChange={onChange}
      />
      <Input
        placeholder={"Название"}
        className={"edit-item-input"}
        key={"name"}
        value={item.name}
        name={"name"}
        onChange={onChange}
      />
      <Input
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
      <Uploader />
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

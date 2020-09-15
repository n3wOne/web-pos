import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { connectToStore } from "../store/ConnectHolder";

class StorageDataScreen extends React.Component {
  renderItem = () => {
    const { data } = this.props;
    return data.map(
      (item) =>
        item && (
          <Link
            key={`link-${item.id}`}
            to={{
              pathname: `/edit-item/${item.id}`,
              state: { item },
            }}
          >
            <div key={item.name} className={"edit-item"}>
              {item.name}
            </div>
          </Link>
        )
    );
  };

  render() {
    const { data } = this.props;
    let newId;
    if (data) {
      newId = Math.max(...data.map((item) => item && item.id)) + 1;
    }
    return (
      <div className={"storage-data-wrapper"}>
        {this.renderItem()}
        <Button title={"Добавить"} icon={<PlusCircleOutlined />}>
          <Link
            to={{
              pathname: `/edit-item`,
              state: { item: null, newId },
            }}
          >
            Добавить
          </Link>
        </Button>
      </div>
    );
  }
}
export default connectToStore(StorageDataScreen);

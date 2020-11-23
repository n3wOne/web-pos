import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";
import { connectToStore } from "../store/ConnectHolder";

const SortableItem = SortableElement(({ item }) => {
  return (
    <li style={{ listStyle: "none" }}>
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
    </li>
  );
});

const SortableList = SortableContainer(({ items, data, ...props }) => {
  return (
    <ul>
      {data &&
        data.map(
          (value, index) =>
            value && (
              <SortableItem
                key={`item-${value.name}`}
                index={index}
                item={value}
              />
            )
        )}
    </ul>
  );
});

class StorageDataScreen extends React.Component {
  onSortEnd = ({ oldIndex, newIndex }) => {
    const { changeOrder } = this.props;
    const newOrder = arrayMove(this.props.data, oldIndex, newIndex);
    changeOrder(newOrder);
  };

  render() {
    const { data } = this.props;
    let newId;
    if (data) {
      newId = Math.max(...data.map((item) => item && item.id)) + 1;
    }

    return (
      <div className={"storage-data-wrapper"}>
        <SortableList
          pressDelay={200}
          data={data}
          items={data}
          onSortEnd={this.onSortEnd}
        />
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

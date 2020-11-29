import * as React from "react";
import { Button } from "antd";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { getDateString, notify } from "../../utils";
import { connectToStore } from "../../store/ConnectHolder";

const StatisticsInvoiceItem = (props) => {
  const { date, item } = props;
  const [deleteButtonWidth, setDeleteButtonWidth] = useState(0);

  const removeItem = () => {
    const conf = window.confirm(`Вы уверены, что хотите удалить запись?`);
    if (conf) {
      props.removeInvoice({ id: date, fetchUrl: props.config.fetchUrl });
      // notify({
      //   type: "success",
      //   message: "Удаление заказа",
      //   description: `Заказ ${getDateString(date)} удален`,
      // });
    }
  };

  const deleteButton = (width) => {
    const styles =
      width > 0
        ? { visibility: "visible", flex: width }
        : { visibility: "hidden", padding: 0, flexBasis: 0 };

    return (
      <Button
        className={"delete-button"}
        style={{
          transition: "250ms ease-in-out",
          ...styles,
        }}
        onClick={removeItem}
      >
        Удалить
      </Button>
    );
  };

  const config = {
    delta: 0, // min distance(px) before a swipe starts
    preventDefaultTouchmoveEvent: false, // call e.preventDefault *See Details*
    trackTouch: true, // track touch input
    trackMouse: true, // track mouse input
    rotationAngle: 0, // set a rotation angle
  };

  const handlers = useSwipeable({
    onSwipedLeft: (eventData) => setDeleteButtonWidth(1),
    onSwipedRight: (eventData) => setDeleteButtonWidth(0),
    onSwiping: (eventData) => {
      if (eventData.absX < 100 && eventData.dir === "Left") {
        setDeleteButtonWidth(eventData.absX / 100);
      }
    },
    ...config,
  });

  return (
    <div
      {...handlers}
      className={"statistics"}
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 20,
        marginTop: 10,
      }}
    >
      <div style={{ flex: 2 }}>{getDateString(date)}</div>
      <div style={{ flex: 3, flexDirection: "column" }}>
        {item.map(({ name, total, count }, index) => (
          <div key={`${name}-${index}`} className={"statistics-item"}>
            <div style={{ flex: 3 }}>{name}</div>
            <div style={{ flex: 1 }}>{+count}</div>
            <div style={{ flex: 1 }}>{+total}</div>
          </div>
        ))}
      </div>
      {deleteButton(deleteButtonWidth)}
    </div>
  );
};

export default connectToStore(StatisticsInvoiceItem);

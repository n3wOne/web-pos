import * as React from "react";
import { Button } from "antd";
import { useState } from "react";
import { getDateString, notify } from "../../utils";
import { connectToStore } from "../../store/ConnectHolder";

const StatisticsInvoiceItem = (props) => {
  const { date, item } = props;
  const [timer, setTimer] = useState(null);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [positionX, setPositionX] = useState({ initialX: 0, currentX: 0 });

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

  const deleteButton = () => {
    return (
      <Button
        className={"delete-button"}
        style={{ transition: "250ms ease-in-out" }}
        onClick={removeItem}
      >
        Удалить
      </Button>
    );
  };

  const handleMove = (event) => {
    const x =
      event.type === "touchmove" ? event.touches[0].clientX : event.clientX;
    setPositionX({ ...positionX, currentX: x });
    if (positionX.initialX - positionX.currentX > 100) {
      setShowDeleteButton(true);
    }
    if (positionX.currentX - positionX.initialX > 100) {
      setShowDeleteButton(false);
    }
  };

  const handlePress = (event) => {
    setTimer(setTimeout(() => setShowDeleteButton(true), 1000));
    const x =
      event.type === "touchstart" ? event.touches[0].clientX : event.clientX;
    setPositionX({ ...positionX, initialX: x });
  };

  const handleReleasePress = (event) => {
    clearTimeout(timer);
    setPositionX({ initialX: 0, currentX: 0 });
  };

  return (
    <div
      className={"statistics"}
      style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 20 }}
      onMouseDown={handlePress}
      onMouseUp={handleReleasePress}
      onTouchStart={handlePress}
      onTouchEnd={handleReleasePress}
      onTouchMove={handleMove}
      onMouseMove={handleMove}
      onBlur={() => setShowDeleteButton(false)}
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
      {showDeleteButton && deleteButton()}
    </div>
  );
};

export default connectToStore(StatisticsInvoiceItem);

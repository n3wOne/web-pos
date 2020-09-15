import * as React from "react";

const StatisticsTotalItem = ({ data, value }) => {
  return (
    <div
      key={`storage-${data}`}
      className={"statistics"}
      style={{ flex: 1, flexDirection: "row" }}
    >
      <div style={{ flex: 3 }}>{data}</div>
      <div style={{ flex: 1 }}>{value.count}</div>
      <div style={{ flex: 1 }}>{value.total}</div>
    </div>
  );
};

export default StatisticsTotalItem;

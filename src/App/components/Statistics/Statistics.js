import * as React from "react";
import { connectToStore } from "../../store/ConnectHolder";
import DataFromStorage from "./DataFromStorage";

import DatePicker from "./DatePicker";

const Statistics = () => {
  return (
    <div style={{ flex: 1 }}>
      <DatePicker />
      <DataFromStorage />
    </div>
  );
};

export default connectToStore(Statistics);

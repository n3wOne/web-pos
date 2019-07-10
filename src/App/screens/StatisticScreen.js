import * as React from "react";
import { Tabs } from "antd";
import { connectToStore } from "../store/ConnectHolder";
import DataFromStorage from "../components/statistics/DataFromStorage";

import StatisticsDaily from "../components/statistics/StatisticsDaily";
import DatePicker from "../components/DatePicker";

const { TabPane } = Tabs;

const SettingsTabs = () => (
  <Tabs centered={true} defaultActiveKey="DataFromStorage">
    <TabPane key={"StatisticsDaily"} tab={"Сессионная"}>
      <StatisticsDaily />
    </TabPane>
    <TabPane key={"DataFromStorage"} tab={"Полная"}>
      <DataFromStorage />
    </TabPane>
  </Tabs>
);

const StatisticScreen = () => {
  return (
    <div style={{ flex: 1 }}>
      <DatePicker />
      <DataFromStorage />
    </div>
  );
};

export default connectToStore(StatisticScreen);

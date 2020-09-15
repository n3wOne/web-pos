import React from "react";
import { Link } from "react-router-dom";
import {
  HomeOutlined,
  LineChartOutlined,
  DatabaseOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const BottomNavigation = () => {
  return (
    <div className={"bottom-navigation"}>
      <Link to="/">
        <div className={"bottom-navigation-item"}>
          <HomeOutlined />
          <div>Главная</div>
        </div>
      </Link>
      <Link to="/statistics">
        <div className={"bottom-navigation-item"}>
          <LineChartOutlined />
          <div>Статистика</div>
        </div>
      </Link>
      <Link to="/editstorage">
        <div className={"bottom-navigation-item"}>
          <DatabaseOutlined />
          <div>База данных</div>
        </div>
      </Link>
      <Link to="/settings">
        <div className={"bottom-navigation-item"}>
          <SettingOutlined />
          <div>Настройки</div>
        </div>
      </Link>
    </div>
  );
};

export default BottomNavigation;

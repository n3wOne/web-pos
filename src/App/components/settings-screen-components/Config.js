import React, { useState } from "react";
import { Input } from "antd";
import { connectConfigToStore } from "../../store/ConnectHolder";

import { ConfigConstants } from "../../Constants";
import { notify } from "../../utils";

const Config = (props) => {
  const [config, setConfig] = useState({
    fetchUrl: props.fetchUrl,
    numColumns: props.numColumns,
  });

  const saveConfig = () => {
    props.setConfig(config);
    notify({
      type: "success",
      message: "Изменение конфигурации",
      description: `Сохранено`,
    });
  };

  const handleKeyPress = ({ key, target }) => {
    if (key === "Enter") {
      target.blur();
    }
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    const newValue = name === "numColumns" ? +value || 3 : value;
    setConfig({ ...config, [name]: newValue });
  };

  return (
    <div className={"config-wrapper"}>
      <div className={"config-item"}>
        <div>{ConfigConstants.FETCH_URL}</div>
        <Input
          name={"fetchUrl"}
          defaultValue={props.fetchUrl.toString()}
          onChange={handleChange}
          onBlur={saveConfig}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className={"config-item"}>
        <div>{ConfigConstants.NUMBER_OF_COLUMNS}</div>
        <Input
          name={"numColumns"}
          type={"number"}
          autoComplete={false}
          defaultValue={props.numColumns.toString()}
          onChange={handleChange}
          onBlur={saveConfig}
          onKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
};

export default connectConfigToStore(Config);

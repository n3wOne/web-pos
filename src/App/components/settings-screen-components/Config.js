import React, { useState } from "react";
import { Checkbox, Input } from "antd";
import { connectConfigToStore } from "../../store/ConnectHolder";

import { ConfigConstants } from "../../Constants";
import { notify } from "../../utils";

const Config = (props) => {
  const [config, setConfig] = useState({
    fetchUrl: props.fetchUrl,
    numColumns: props.numColumns,
    totalBlock: props.totalBlock,
    errors: props.errors,
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
    // const newValue = name === "numColumns" ? +value || 3 : value;
    let newValue;
    switch (name) {
      case "numColumns":
        newValue = +value || 3;
        break;
      case "totalBlock":
        newValue = target.checked;
        setConfig({ ...config, [name]: newValue });
        return props.setConfig({ ...config, [name]: newValue });
      default:
        newValue = value;
    }
    setConfig({ ...config, [name]: newValue });
  };

  // console.log(config);

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
      <div
        className={"config-item"}
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <div style={{ margin: "10px" }}>{ConfigConstants.TOTAL_BLOCK}</div>
        <Checkbox
          style={{ width: "unset" }}
          name={"totalBlock"}
          type={"checkbox"}
          defaultChecked={props.totalBlock}
          onChange={handleChange}
          // onBlur={saveConfig}
          // onClick={saveConfig}
        />
      </div>
    </div>
  );
};

export default connectConfigToStore(Config);

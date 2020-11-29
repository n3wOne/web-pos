import React, { Component } from "react";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Input } from "antd";

export default class NumericInput extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      value: props.value || 1,
    };
  }

  inc = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let { value } = this.state;
    value += 1;
    this.setState({ value });
    this.props.onChange({
      ...this.props.item,
      count: value,
    });
  };

  dec = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { value } = this.state;
    // value -= 1;
    this.setState({ value: value - 1 });
    this.props.onChange({
      ...this.props.item,
      count: value - 1,
    });
  };

  onChange = ({ target: { value } }) => {
    this.setState({ value });
  };

  onKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
      e.target.blur();
    }
  };

  onBlur = (e) => {
    const { item } = this.props;
    this.props.onChange({
      ...item,
      count: parseFloat(e.target.value),
    });
  };

  render() {
    return (
      <div
        className={"item-button-wrapper"}
        onClick={(e) => e.stopPropagation()}
      >
        <MinusOutlined
          className={"button-plus-minus"}
          onClickCapture={this.dec}
        />
        <div className={"item-count-input"}>
          <Input
            defaultValue={this.props.value}
            onChange={this.onChange}
            ref={this.ref}
            value={this.state.value}
            onFocus={() => this.setState({ value: null })}
            onKeyPress={this.onKeyPress}
            onBlur={this.onBlur}
            type={"number"}
          />
        </div>
        <PlusOutlined
          onClickCapture={this.inc}
          className={"button-plus-minus"}
        />
      </div>
    );
  }
}

import React, { useState } from "react";
import styled from "styled-components";
import NumericInput from "./NumericInput";
import { connectToStore } from "../../store/ConnectHolder";

const StyledItem = styled.div`
  ${({ numColumns, empty, item }) => `
     overflow: hidden;
    flex: 1;
    flex-basis: calc(${100 / numColumns}% - 1rem);
    max-width: 250px;
    position: relative;
    ${!empty && `border: 1px solid #ccc;`}
        &:before {
      content: "";
      float: left;
      padding-top: 100%;
    }
    &:after {
      content: "";
      background-image: url(${item && item.imgUrl});
      background-position: center center;
      background-size: cover;
      background-repeat: no-repeat;
      opacity: 0.25;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      position: absolute;
      z-index: -1;   
    }
  `}
`;

class Item extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weight: 1,
      showModal: false,
      count: 0,
    };
  }

  onClick = () => {
    const { item, addProductToCart, setCartItemCount, cartItems } = this.props;
    const itemInCart = cartItems.has(item.id);
    const itemCount = itemInCart ? cartItems.get(item.id).count : 0;

    return itemInCart
      ? setCartItemCount({ ...item, count: itemCount + 1 })
      : addProductToCart(item);
  };

  render() {
    const {
      item,
      cart,
      setCartItemCount,
      cartItems,
      numColumns,
      empty,
    } = this.props;
    if (empty) {
      return (
        <StyledItem
          numColumns={numColumns}
          empty={true}
          className={"item-wrapper"}
        />
      );
    }
    const itemInCart = cartItems.has(item.id);
    const itemCount = itemInCart ? cart.cartItems.get(item.id).count : 0;
    return (
      <StyledItem numColumns={numColumns} item={item} onClick={this.onClick}>
        <div className={"item-wrapper"}>
          <div className={"item-price"}>{item.price}</div>
          <div className={"item-name"}>{item.name}</div>
          {itemInCart && (
            <NumericInput
              key={`numeric-${item.id}`}
              item={item}
              value={itemCount}
              onChange={setCartItemCount}
            />
          )}
        </div>
      </StyledItem>
    );
  }
}

export default connectToStore(Item);

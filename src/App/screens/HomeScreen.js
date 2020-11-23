import React, { useState } from "react";
import styled from "styled-components";
import { connectToStore } from "../store/ConnectHolder";
import Item from "../components/home-screen-components/Item";
import data from "../store/data";
import TotalForm from "../components/home-screen-components/TotalForm";

const StyledDiv = styled.div`
  ${({ numColumns }) => `
    flex: 1;
    flex-basis: calc(${100 / numColumns}% - 1rem);
  `}
`;
// const numColumns = 3;

const HomeScreen = (props) => {
  const renderItem = (data) => {
    const {
      addProductToCart,
      setCartItemCount,
      config: { numColumns },
    } = props;
    if (data.length % numColumns !== 0) {
      for (let i = 0; i < data.length % numColumns; i++) {
        data && data.push(null);
      }
    }
    return data.map((item, index) =>
      item ? (
        <Item
          key={`${item.name}-${item.price}-${item.id}`}
          cartItems={props.cartItems}
          cart={props.cart}
          numColumns={numColumns}
          addProductToCart={addProductToCart}
          setCartItemCount={setCartItemCount}
          item={item}
        />
      ) : (
        <Item key={`empty-${index}`} empty={true} numColumns={numColumns} />
      )
    );
  };
  const {
    data: newData,
    cartItems,
    cartTotal,
    removeProductFromCart,
    config: { totalBlock },
  } = props;
  console.log(totalBlock)
  return !newData ? (
    <div>Loading...</div>
  ) : (
    <div className={"products"}>
      <div className={"products-container"}>{renderItem(newData)}</div>
      {totalBlock && (
        <TotalForm
          removeProductFromCart={removeProductFromCart}
          cartItems={cartItems}
          cartTotal={cartTotal}
        />
      )}
    </div>
  );
};

HomeScreen.defaultProps = {
  config: {
    numColumns: 3,
  },
};
export default connectToStore(HomeScreen);

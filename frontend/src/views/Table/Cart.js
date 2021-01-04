import React from "react";

import { Card, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import CartItem from "./CartItem";

const Cart = () => {
  const orderState = useSelector((state) => state.order) || {};
  const selectedProducts = orderState.selectedProducts || [];

  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        gutterBottom
        variant="h5"
        style={{ padding: "1rem", color: "black" }}
        component="h2"
      >
        Items in cart
      </Typography>
      {selectedProducts.map((item) => {
        return <CartItem key={item.id} item={item} />;
      })}
    </Card>
  );
};
export default Cart;

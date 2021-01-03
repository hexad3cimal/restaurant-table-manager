import React from "react";

import { Card, CardActions, CardContent, Typography } from "@material-ui/core";

const CartItem = ({ item }) => {
  
  return (
    <Card
    >
           <CardContent>
           <Typography color="textSecondary" gutterBottom>
{item.name}        </Typography>
           </CardContent>
           <CardActions>
      </CardActions>
    </Card>
  );
};
export default CartItem;

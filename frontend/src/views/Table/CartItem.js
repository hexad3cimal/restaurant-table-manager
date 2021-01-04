import React from "react";

import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import { addProductToOrder, removeProductFromOrder } from "../../actions";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import RemoveIcon from '@material-ui/icons/Remove';
const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const onAdd = (product) => {
    const productClone = Object.assign({}, product);
    productClone.quantity = 1;
    dispatch(addProductToOrder(productClone));
  };

  const onRemove = (product) => {
    dispatch(removeProductFromOrder(product));
  };

  return (
    <Card>
      <CardContent>
        <Box p={2}>
          <Grid container justify="space-around" spacing={2}>
            <Typography gutterBottom>{item.name}</Typography>
            <Chip
              size="small"
              icon={<ControlPointIcon style={{ fill: "white" }} />}
              label="Add"
              onClick={() =>onAdd(item)}
              style={{background:'#02c39a'}}
            />
            <Typography gutterBottom variant="h5">
              {item.quantity} Nos
            </Typography>
            <Chip
              size="small"
              icon={<RemoveIcon style={{ fill: "white" }} />}
              label="Remove"
              onClick={() =>onRemove(item)}
              style={{background:'#f94144'}}
            />
            <Typography gutterBottom variant="h5">
             $ {item.cost}
            </Typography>
          </Grid>
        </Box>
      </CardContent>
      <CardActions></CardActions>
    </Card>
  );
};
export default CartItem;

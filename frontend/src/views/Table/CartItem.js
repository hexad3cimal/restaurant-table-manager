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
import RemoveIcon from "@material-ui/icons/Remove";
import { Fade } from "react-awesome-reveal";

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
    <Grid xs={12}>
      <Fade>
      <Card>
        <CardContent>
          <Box p={2}>
            <Grid container justify="space-around" spacing={2}>
              <Grid xs={3}>
                <Typography gutterBottom>{item.name}</Typography>
              </Grid>
              <Grid style={{ display: "flex", flexDirection: "column" }} xs={3}>
                <Chip
                  size="small"
                  icon={<ControlPointIcon style={{ fill: "green" }} />}
                  label="Add"
                  onClick={() => onAdd(item)}
                  style={{
                    width: "5rem",
                    fontSize: ".7rem",
                  }}
                />

                <Typography
                  style={{ fontSize: ".7rem", width: "5rem"}}
                  variant="h5"
                  align="center"
                >
                  {item.quantity} Nos
                </Typography>

                <Chip
                  size="small"
                  icon={<RemoveIcon style={{ fill: "red" }} />}
                  label="Remove"
                  onClick={() => onRemove(item)}
                  style={{
                    width: "5rem",
                    fontSize: ".7rem",
                  }}
                />
              </Grid>
              <Grid xs={3}>
                <Typography gutterBottom variant="h5">
                  $ {item.cost}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <CardActions></CardActions>
      </Card>
      </Fade>
    </Grid>
  );
};
export default CartItem;

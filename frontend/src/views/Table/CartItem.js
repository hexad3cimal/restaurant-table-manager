import React from "react";

import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import { addProductToOrder, removeProductFromOrder } from "../../actions";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import RemoveIcon from "@material-ui/icons/Remove";
import { Fade } from "react-awesome-reveal";

const useStyles = makeStyles((theme) => ({
  cartItems: {
    width: "5rem",
    fontSize: ".7rem",
  },
  addButton: {
    fill: theme.colors.red
  },
  removeButton: {
    fill: theme.colors.green
  },
}));

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
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
          <CardContent style={{padding: 'unset'}}>
            <Box p={2}>
              <Grid container justify="space-around" spacing={2}>
                <Grid xs={3}>
                  <Typography gutterBottom>{item.name}</Typography>
                </Grid>
                <Grid
                  style={{ display: "flex", flexDirection: "column" }}
                  xs={3}
                >
                  <Chip
                    size="small"
                    icon={<ControlPointIcon className={classes.addButton} />}
                    label="Add"
                    onClick={() => onAdd(item)}
                    className={classes.cartItems}
                  />

                  <Typography
                    className={classes.cartItems}
                    variant="h5"
                    align="center"
                  >
                    {item.quantity} Nos
                  </Typography>

                  <Chip
                    size="small"
                    icon={<RemoveIcon className={classes.removeButton} />}
                    label="Remove"
                    onClick={() => onRemove(item)}
                    className={classes.cartItems}
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

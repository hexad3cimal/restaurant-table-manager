import React from "react";

import {
  Box,
  Card,
  CardActions,
  CardContent,
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
    fill: theme.colors.red,
    '&:hover':{
      fill:'black',
    },
    cursor: 'pointer'
  },
  removeButton: {
    fill: theme.colors.green,
    '&:hover':{
      fill:'black'
    },
    cursor: 'pointer'
  },
  actionsCard: {
    display: "flex",
    padding: ".5rem",
    background: "#eae9e92b",
  },
}));

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const onAdd = (product) => {
    const productClone = Object.assign({}, product);
    productClone.quantity = 1;
    productClone.cartItemPanel = true;
    dispatch(addProductToOrder(productClone));
  };

  const onRemove = (product) => {
    dispatch(removeProductFromOrder(product));
  };

  return (
    <Grid item xs={12}>
      <Fade>
        <Card>
          <CardContent style={{ padding: "unset" }}>
            <Box p={2}>
              <Grid container justify="space-between" spacing={1}>
                <Grid item xs={5}>
                  <Typography noWrap>{item.name}</Typography>
                </Grid>
                <Grid
                  xs={4}
                  item
                >
                  <Card className={classes.actionsCard}>
                    <ControlPointIcon
                      onClick={() => onAdd(item)}
                      className={classes.addButton}
                    />
                    <Typography
                      className={classes.cartItems}
                      variant="h5"
                      align="center"
                    >
                      {item.quantity}
                    </Typography>
                    <RemoveIcon
                      onClick={() => onRemove(item)}
                      className={classes.removeButton}
                    />
                  </Card>
                </Grid>
                <Grid item xs={3}>
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

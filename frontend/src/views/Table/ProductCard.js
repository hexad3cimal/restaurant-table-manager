import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  Avatar,
  IconButton,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Flip } from "react-awesome-reveal";
import { addProductToOrder, removeProductFromOrder } from "../../actions";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const orderState = useSelector((state) => state.order) || {};
  const selectedProducts = orderState.selectedProducts || [];
  let count = selectedProducts.filter((p) => {
    return p.id === product.id;
  });

  const onAdd = (product) => {
    const productClone = Object.assign({}, product)
    productClone.quantity = 1
    dispatch(addProductToOrder(productClone));
  };

  const onRemove = (product) => {
    dispatch(removeProductFromOrder(product));
  };

  return (
    <Flip direction="vertical">
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" mb={3}>
            <Avatar alt="Product" src={product.image} variant="square" />
          </Box>
          <Typography
            align="center"
            color="textPrimary"
            gutterBottom
            variant="h4"
          >
            {product.name}
          </Typography>
          <Typography align="center" color="textPrimary" variant="body1">
            {product.descrption}
          </Typography>
        </CardContent>
        <Divider />
        <Box p={2}>
          <Grid container justify="space-between" spacing={2}>
            <IconButton
              onClick={() => {
                onAdd(product);
              }}
              aria-label="add"
            >
              <ControlPointIcon />
            </IconButton>
            <Typography
              align="center"
              color="textPrimary"
              gutterBottom
              variant="h4"
            >
              {count[0] &&count[0].quantity}
            </Typography>
            <IconButton  onClick={() => {
                onRemove(product);
              }} aria-label="remove">
              <IndeterminateCheckBoxIcon />
            </IconButton>
          </Grid>
        </Box>
      </Card>
    </Flip>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductCard;

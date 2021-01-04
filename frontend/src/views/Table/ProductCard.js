import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  IconButton,
  CardMedia,
  makeStyles,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Flip } from "react-awesome-reveal";
import { addProductToOrder, removeProductFromOrder } from "../../actions";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";

const useStyles = makeStyles({
  media: {
    height: 140,
  },
});

const ProductCard = ({ product }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const orderState = useSelector((state) => state.order) || {};
  const selectedProducts = orderState.selectedProducts || [];
  let selectedProduct = selectedProducts.find((p) => {
    return p.id === product.id;
  });

  const onAdd = (product) => {
    const productClone = Object.assign({}, product);
    productClone.quantity = 1;
    dispatch(addProductToOrder(productClone));
  };

  const onRemove = (product) => {
    dispatch(removeProductFromOrder(product));
  };

  return (
    <Flip direction="vertical">
      <Card style={{ margin: ".5rem" }}>
        <CardContent>
          <CardMedia
            image={product.image}
            title={product.name}
            className={classes.media}
          />
          <Typography
            align="center"
            gutterBottom
            variant="h5"
            style={{ color: "black" }}
          >
            {product.name}
          </Typography>
          <Typography align="center" style={{ color: "black" }} variant="body2">
            Rs {product.price}
          </Typography>
          <Typography align="center" color="grey" variant="body2">
            {product.description}
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
              style={{fontSize:'1rem'}}
            >
              <ControlPointIcon style={{ fill: "green" }} /> Add
            </IconButton>
            <Typography
              align="center"
              color="textPrimary"
              gutterBottom
              style={{fontSize:'1rem'}}

            >
              {selectedProduct && selectedProduct.quantity + ' Nos' } 
            </Typography>
            <IconButton
              onClick={() => {
                onRemove(product);
              }}
              aria-label="remove"
              style={{fontSize:'1rem'}}

            >
              <IndeterminateCheckBoxIcon style={{ fill: "#f94144" }} /> Remove
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

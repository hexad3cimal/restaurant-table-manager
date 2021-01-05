import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  CardMedia,
  makeStyles,
  Button,
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
  button: {
    border: '1px solid black',
    color: 'black'
  }
});

const ProductCard = ({ product, index }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const orderState = useSelector((state) => state.order) || {};
  const selectedProducts = orderState.selectedProducts || [];
  let selectedProduct = selectedProducts.find((p) => {
    return p.id === product.id;
  });

  const cardColors = ["", "#ffd166", "#06d6a0", "#9d4edd", "#8ac926"];
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
      <Card style={{ margin: ".5rem", background: cardColors[index] }}>
        <CardContent>
          {product.image && (
            <CardMedia
              image={product.image}
              title={product.name}
              className={classes.media}
            />
          )}
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
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                onAdd(product);
              }}
              className={classes.button}
              endIcon={<ControlPointIcon style={{ fill: "green" }} />}
            >
              Add
            </Button>

            <Typography
              align="center"
              color="textPrimary"
              gutterBottom
              style={{ fontSize: "1rem" }}
            >
              {selectedProduct && selectedProduct.quantity + " Nos"}
            </Typography>

            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                onRemove(product);
              }}
              className={classes.button}
              endIcon={
                <IndeterminateCheckBoxIcon style={{ fill: "#f94144" }} />
              }
            >
              Remove
            </Button>
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

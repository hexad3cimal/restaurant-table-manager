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

const useStyles = makeStyles((theme) => ({
  media: {
    height: 140,
  },
  button: {
    border: "1px solid black",
    color: theme.palette.text.primary,
  },
  productName: {
    color: theme.palette.text.primary,
    fontSize: '1.6rem'
  },
  productCard:{
    margin: ".5rem",
    backgroundColor: theme.colors.white
  },
  price: {
    color: theme.palette.text.primary,
    fontSize: '1rem'
  },
  description: {
    color: theme.palette.text.primary,
    fontSize: '.7rem'
  },
  addButton: {
    fill: theme.colors.red,
  },
  removeButton: {
    fill: theme.colors.green,
  },
}));

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
      <Card className={classes.productCard} >
        <CardContent>
          {product.image && (
            <CardMedia
              image={product.image}
              title={product.name}
              className={classes.media}
            />
          )}
          <Typography
            gutterBottom
            className={classes.productName}
          >
            {product.name}
          </Typography>
          <Typography  className={classes.price}>
            Rs {product.price}
          </Typography>
          <Typography className={classes.description}>
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
              endIcon={<ControlPointIcon className={classes.removeButton} />}
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
                <IndeterminateCheckBoxIcon className={classes.addButton} />
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

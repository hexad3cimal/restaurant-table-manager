import React, { useRef, useState } from "react";
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
import { AttentionSeeker } from "react-awesome-reveal";
import { addProductToOrder, removeProductFromOrder } from "../../actions";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import CustomisationList from "./CustomisationList";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  media: {
    height: 140,
  },
  button: {
    border: "1px solid black",
    color: theme.palette.text.primary,
    "&:hover": {
      color: "green",
      "& .MuiButton-endIcon": {
        fill: "black",
        transform: "translateX(3px)",
        transition: "all 0.2s ease",
      },
    },
  },
  customisationButton: {
    fontSize: ".6rem",
    width: "13rem",
    lineHeight: ".1rem",
    marginBottom: "1rem",
  },
  productName: {
    color: theme.palette.text.primary,
    fontSize: "1.6rem",
    fontWeight: "750",
    lineHeight: "1.8rem",
  },
  productCard: {
    marginBottom: ".7rem",
    "&:hover": {
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    },
  },
  focused: {
    backgroundColor: "#f1faee",
  },
  productCardContent: {
    display: "flex",
    flexDirection: "column",
  },
  price: {
    color: theme.palette.text.primary,
    fontSize: "1rem",
  },
  description: {
    color: theme.palette.text.primary,
    fontSize: ".7rem",
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
  const selectedCustomisations = useRef([]);
  const [enableCustomisation, setCustomisationStatus] = useState(false);
  const orderedProduct = useRef({});
  let selectedProduct =
    selectedProducts.find((p) => {
      return p.id === product.id;
    }) || {};

  const onAdd = (product) => {
    const productClone = Object.assign({}, product);
    productClone.quantity = 1;
    productClone.price = product.price;
    orderedProduct.current = productClone;
    if (productClone.customisation.length) setCustomisationStatus(true);
    else {
      onFinalAdd();
    }
  };

  const onFinalAdd = () => {
    orderedProduct.current.customisations = selectedCustomisations.current;
    dispatch(addProductToOrder(orderedProduct.current));
    orderedProduct.current = {};
    selectedCustomisations.current = [];
    setCustomisationStatus(false);
  };
  const onRemove = (product) => {
    dispatch(removeProductFromOrder(product));
  };
  const onCusmisationSelect = (customisation, requiredChange) => {
    if (requiredChange === "add") {
      selectedCustomisations.current = [
        ...selectedCustomisations.current,
        customisation,
      ];
    } else if (requiredChange === "remove") {
      selectedCustomisations.current = selectedCustomisations.current.filter(
        (e) => e.id !== customisation.id
      );
    }
  };

  return (
    <AttentionSeeker effect="pulse">
      <Card
        className={
          enableCustomisation
            ? clsx(classes.productCard, classes.focused)
            : classes.productCard
        }
      >
        <CardContent className={classes.productCardContent}>
          {enableCustomisation ? (
            <CustomisationList
              selected={selectedCustomisations.current}
              customisations={product.customisation}
              onDone={onFinalAdd}
              onSelect={onCusmisationSelect}
            />
          ) : (
            <Box>
              {product.image && (
                <CardMedia
                  image={product.image}
                  title={product.name}
                  className={classes.media}
                />
              )}
              <Typography gutterBottom className={classes.productName}>
                {product.name}
              </Typography>

              <Typography className={classes.price}>
                Rs {product.price}
              </Typography>
              <Typography className={classes.description}>
                {product.description}
              </Typography>
            </Box>
          )}
        </CardContent>
        <Divider />
        <Box p={2}>
          {!enableCustomisation ? (
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
                {((selectedProduct && selectedProduct.quantity) || 0) + " Nos"}
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
          ) : null}
        </Box>
      </Card>
    </AttentionSeeker>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductCard;

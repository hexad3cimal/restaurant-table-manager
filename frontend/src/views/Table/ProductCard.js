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

const useStyles = makeStyles((theme) => ({
  media: {
    height: 140,
  },
  button: {
    border: "1px solid black",
    color: theme.palette.text.primary,
  },
  customisationButton: {
    fontSize: ".6rem",
    width:'13rem',
    lineHeight:'.1rem',
    marginBottom:'1rem'
  },
  productName: {
    color: theme.palette.text.primary,
    fontSize: "1.6rem",
  },
  productCard: {
    margin: ".5rem",
    backgroundColor: theme.colors.white,
  },
  productCardContent: {
    display:'flex',
    flexDirection:'column',
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
  const selectectedCustomisations = useRef([]);
  const [enableCustomisation, setCustomisationStatus] = useState(false);
  let selectedProduct = selectedProducts.find((p) => {
    return p.id === product.id;
  });

  const onAdd = (product) => {
 
    const productClone = Object.assign({}, product);
    productClone.quantity = 1;
    productClone.customisations = selectectedCustomisations.current
    console.log(parseInt(productClone.price)+selectectedCustomisations.current.reduce((a, b) => {
      if(b.ProductId === product.id)
        return a + parseInt(b.price)
        else return 0
    }, 0))
    productClone.price = parseInt(productClone.price)+selectectedCustomisations.current.reduce((a, b) => {
      return a+ parseInt(b.price)
    }, 0)
    dispatch(addProductToOrder(productClone));
  };

  const onRemove = (product) => {
    dispatch(removeProductFromOrder(product));
  };
  const onCusmisationSelect = (customisation, requiredChange) => {
    if (requiredChange === "add") {
        selectectedCustomisations.current = [...selectectedCustomisations.current,customisation];
    } else {
       selectectedCustomisations.current.splice(selectectedCustomisations.current.findIndex(e=>e.id===customisation.id),1)
    }
  };

  return (
    <AttentionSeeker effect="pulse">
      <Card className={classes.productCard}>
        <CardContent className={classes.productCardContent}>
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
          {product.customisation.length && !enableCustomisation ? (
            <Button
            variant="contained"
              className={classes.customisationButton}
              onClick={() => {
                setCustomisationStatus(!enableCustomisation);
              }}
            >
              Click here for customisations
            </Button>
          ) : (
            <CustomisationList
              selected={selectectedCustomisations.current}
              customisations={product.customisation}
              onDone={setCustomisationStatus}
              onSelect={onCusmisationSelect}
            />
          )}
          <Typography className={classes.price}>Rs {product.price}</Typography>
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
    </AttentionSeeker>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductCard;

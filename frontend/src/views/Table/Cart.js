import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import {
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Fade } from "react-awesome-reveal";

import CartItem from "./CartItem";
import { addOrder } from "../../actions";
import { Plus } from "react-feather";
import { green } from "@material-ui/core/colors";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  emptyCart: {
    display: "flex",
    flexDirection: "column",
  },
  emptyCartImage: {
    width: "10rem",
    alignSelf: "center",
  },
  emptyCartText: {
    color: theme.palette.text.primary,
    fontSize: "1.2rem",
    alignSelf: "center",
    paddingBottom: "1rem",
  },
  cartTitle: {
    color: theme.palette.text.primary,
    fontSize: "1.4rem",
    padding: "1rem",
    fontWeight: 800,
  },
  cartTitleMobile: {
    color: theme.palette.text.primary,
    fontSize: "1rem",
    padding: "1rem",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  orderButton: {
    backgroundColor: theme.colors.green,
  },
  orderBox: {
    display: "flex",
    justifyContent: "space-between",
  },
  icon: {
    verticalAlign: "bottom",
    height: 20,
    width: 20,
  },
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "33.33%",
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const Cart = () => {
  const dispatch = useDispatch();
  const orderState = useSelector((state) => state.order) || {};
  const tableState = useSelector((state) => state.table) || {};
  const selectedProducts = orderState.selectedProducts || [];
  const [cartClicked, setCartClicked] = useState(false);
  const orderedProducts =
    selectedProducts
      .map((product) => product["items"])
      .reduce((product1, product2) => product1.concat(product2), []) || [];
  const classes = useStyles();
  let totalCost = 0;
  orderedProducts.forEach((product) => {
    const productTotalPrice =
      product.customisations.reduce(
        (customisation1, customisation2) =>
          customisation1 + customisation2.price,
        0
      ) + product.price;
    if (product.quantity > 1)
      totalCost = totalCost + productTotalPrice * product.quantity;
    else {
      totalCost = totalCost + productTotalPrice;
    }
  });
  const placeOrder = () => {
    const order = {};
    let productsInOrder = orderedProducts.slice(0);
    productsInOrder = productsInOrder.map((product) => {
      let productClone = Object.assign({}, product);
      productClone.customisations = product.customisations.map(
        (customisation) => {
          return customisation.id;
        }
      );
      return productClone;
    });
    order.tableId = tableState.selectedTable.id;
    order.products = productsInOrder;
    order.price = totalCost;
    order.status = "ordered";
    dispatch(addOrder(order));
  };
  const renderCart = () => {
    if (isMobile) {
      return (
        <Grid container justify="center" fullWidth={true}>
          {cartClicked ? (
            <Card
              style={{
                bottom: "0",
                position: "fixed",
                width: "90%",
                maxHeight: "70vh",
                overflow: "scroll",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon  onClick={() => {
                  setCartClicked(!cartClicked);
                }} />}
              >
                <Typography className={classes.cartTitleMobile}>
                  Items in your cart
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.details}>
                <Card
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  {orderedProducts.map((item, index) => {
                    return <CartItem key={item.id + index} item={item} />;
                  })}
                </Card>
              </AccordionDetails>
              <Divider />
              <AccordionActions>
                <Button className={classes.orderButton} size="small">
                  Checkout
                </Button>
              </AccordionActions>
            </Card>
          ) : (
            <Button
              style={{
                bottom: "0",
                position: "fixed",
                background: green[500],
                margin:'1rem'
              }}
              variant="contained"
              onClick={() => {
                setCartClicked(!cartClicked);
              }}
            >
              Cart
            </Button>
          )}
        </Grid>
      );
    }

    return (
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "20vh",
          width:'30%'
        }}
      >
          <Typography gutterBottom className={classes.cartTitle} component="h2">
            Items in your cart
          </Typography>
          {selectedProducts.length === 0 && (
            <Box className={classes.emptyCart}>
              <img
                alt="empty-cart"
                src="/images/empty-plate.png"
                className={classes.emptyCartImage}
              />
              <Typography
                variant="h5"
                component="h2"
                className={classes.emptyCartText}
              >
                Uh, oh! your cart looks empty
              </Typography>
            </Box>
          )}
          {orderedProducts.map((item, index) => {
            return <CartItem key={item.id + index} item={item} />;
          })}
          <Divider />
          {selectedProducts.length > 0 ? (
            <Grid item xs={12}>
              <Fade>
                <CardContent>
                  <Box className={classes.orderBox}>
                    <Typography gutterBottom variant="h5">
                      Total Cost: {totalCost}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => {
                        placeOrder();
                      }}
                      disabled={!selectedProducts.length}
                      className={classes.orderButton}
                      endIcon={<Plus />}
                    >
                      Place Order
                    </Button>
                  </Box>
                </CardContent>
              </Fade>
            </Grid>
          ) : (
            <div></div>
          )}
      </Box>
    );
  };

  return renderCart();
};
export default Cart;

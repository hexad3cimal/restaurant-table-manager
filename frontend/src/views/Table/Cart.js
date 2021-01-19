import React from "react";
import { isMobile } from "react-device-detect";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardActions,
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
  const orderedProducts =
    selectedProducts
      .map((product) => product[Object.keys(product)[0]]["items"])
      .reduce((product1, product2) => product1.concat(product2), []) || [];

  console.log("orderedproducts", orderedProducts);
  const classes = useStyles();
  let totalCost = 0;
  selectedProducts.forEach((p) => {
    if (p.cost > p.price) totalCost = totalCost + parseInt(p.cost);
    else {
      totalCost = totalCost + parseInt(p.price);
    }
  });
  const placeOrder = () => {
    const order = {};
    order.tableId = tableState.selectedTable.id;
    order.products = selectedProducts;
    order.price = totalCost.toString();
    order.status = "ordered";
    dispatch(addOrder(order));
  };
  const renderCart = () => {
    if (isMobile) {
      return (
        <Accordion
          style={{
            bottom: "0",
            position: "fixed",
            width: "90%",
            maxHeight: "70vh",
            overflow: "scroll",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1c-content"
            id="panel1c-header"
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
              {selectedProducts.map((item) => {
                return <CartItem key={item.id} item={item} />;
              })}
            </Card>
          </AccordionDetails>
          <Divider />
          <AccordionActions>
            <Button className={classes.orderButton} size="small">
              Checkout
            </Button>
          </AccordionActions>
        </Accordion>
      );
    }

    return (
      <Fade>
        <Card
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "20vh",
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
          {orderedProducts.map((item) => {
            return <CartItem key={item.id} item={item} />;
          })}
        </Card>
        {selectedProducts.length > 0 ? (
          <Grid xs={12}>
            <Fade>
              <Card>
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
                <CardActions></CardActions>
              </Card>
            </Fade>
          </Grid>
        ) : (
          <div></div>
        )}
      </Fade>
    );
  };

  return renderCart();
};
export default Cart;

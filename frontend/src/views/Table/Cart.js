import React from "react";
import { isMobile } from "react-device-detect";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  Divider,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PerfectScrollbar from 'react-perfect-scrollbar';

import CartItem from "./CartItem";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
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
  const orderState = useSelector((state) => state.order) || {};
  const selectedProducts = orderState.selectedProducts || [];
  const classes = useStyles();
  const renderCart = () => {
    if (isMobile) {
      return (
        <Accordion  style={{ bottom: "0", position: "fixed", width:'90%' , overflow:'scroll'}}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1c-content"
            id="panel1c-header"
          >
            <div className={classes.column}>
              <Typography className={classes.heading}>
                Items in your cart
              </Typography>
            </div>
          </AccordionSummary>
          <AccordionDetails  className={classes.details}>
          <PerfectScrollbar>
            <Card
              style={{
                display: "flex",
                flexDirection: "column",
                width:'100%'
              }}
            >
              {selectedProducts.map((item) => {
                return <CartItem key={item.id} item={item} />;
              })}
            </Card>
            </PerfectScrollbar>
          </AccordionDetails>
          <Divider />
          <AccordionActions>
            <Button size="small">Checkout</Button>
          </AccordionActions>
        </Accordion>
      );
    }

    return (
      <Card
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          gutterBottom
          variant="h5"
          style={{ padding: "1rem", color: "black" }}
          component="h2"
        >
          Items in cart
        </Typography>
        {selectedProducts.map((item) => {
          return <CartItem key={item.id} item={item} />;
        })}
      </Card>
    );
  };

  return renderCart();
};
export default Cart;

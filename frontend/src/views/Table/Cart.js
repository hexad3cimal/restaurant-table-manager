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
import { useSelector } from "react-redux";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Fade } from "react-awesome-reveal";

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
  let totalCost = 0;
  selectedProducts.forEach( p => {
    if(p.cost>p.price)
      totalCost =totalCost+parseInt(p.cost)
      else{
        totalCost =totalCost+parseInt(p.price)
      }
  })
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
            <div className={classes.column}>
              <Typography className={classes.heading}>
                Items in your cart
              </Typography>
            </div>
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
            <Button size="small">Checkout</Button>
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
        {selectedProducts.length>0 ?  <Grid xs={12}>
      <Fade>
      <Card>
        <CardContent>
          <Box p={2}>
      Total {totalCost}
             
          </Box>
        </CardContent>
        <CardActions>

        </CardActions>
      </Card>
      </Fade>
    </Grid>: <div></div>}
      </Fade>
    );
  };

  return renderCart();
};
export default Cart;

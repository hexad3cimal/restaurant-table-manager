import React, { useEffect } from "react";
import { Box, Container, Grid, makeStyles } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import Page from "../../components/Page";
import AddProduct from "./AddProduct";
import Toolbar from "./Toolbar";
import { getProducts } from "../../actions";
import ProductList from "./ProductList";
const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const Products = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const productState = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
  }, []);
  return (
    <Page className={classes.root} title="Products">
      <Container maxWidth={false}>
        {productState && productState.add ? (
          <Box mt={3}>
            <AddProduct />
          </Box>
        ) : (
          <Grid container>
            <Grid item xs={12}>
              <Box mt={3}>
                <Toolbar />
                <ProductList products={productState.products || []} />
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>
    </Page>
  );
};

export default Products;

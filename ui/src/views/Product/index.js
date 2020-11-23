import React, { useEffect, useState } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Page from '../../components/Page';
import AddProduct from './AddProduct';
import Toolbar from './Toolbar';
import { getProducts } from '../../actions';
import ProductList from './ProductList';
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const Products = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const appState = useSelector(state => state.app);
  const productState = useSelector(state => state.product);

  if (productState && productState.new) {
    dispatch(getProducts());
  }
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
          <Box mt={3}>
            <Toolbar />

            <ProductList products={productState.products || []} />
          </Box>
        )}
      </Container>
    </Page>
  );
};

export default Products;

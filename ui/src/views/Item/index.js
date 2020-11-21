import React, { useEffect, useState } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Page from '../../components/Page';
import TableList from './TableList';
import Toolbar from './Toolbar';
import { getTablesOfOrg } from '../../actions';
import AddTable from './AddTable';
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
    dispatch(getTablesOfOrg());
  }
  useEffect(() => {
    dispatch(getTablesOfOrg());
  }, []);
  return (
    <Page className={classes.root} title="Tables">
      <Container maxWidth={false}>
        {tableState && tableState.add ? (
          <Box mt={3}>
            <AddTable />
          </Box>
        ) : (
          <Box mt={3}>
            <Toolbar />

            <TableList />
          </Box>
        )}
      </Container>
    </Page>
  );
};

export default Item;

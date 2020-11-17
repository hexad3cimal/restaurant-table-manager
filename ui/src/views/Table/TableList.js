import React, { useState } from 'react';
import { Box, Container, Grid, makeStyles } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import Page from '../../components/Page';
import Toolbar from './Toolbar';
import TableCard from './TableCard';
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  tableCard: {
    height: '100%',
  },
}));

const TableList = () => {
  const classes = useStyles();
  const tableState = useSelector(state => state.table);
  const tables = (tableState && tableState.orgTables) || [];
  return (
    <Page className={classes.root} title="Products">
      <Container maxWidth={false}>
        <Box mt={3}>
          <Grid container spacing={3}>
            {tables.map(table => (
              <Grid item key={table.id} lg={4} md={6} xs={12}>
                <TableCard className={classes.tableCard} table={table} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination color="primary" count={3} size="small" />
        </Box>
      </Container>
    </Page>
  );
};

export default TableList;

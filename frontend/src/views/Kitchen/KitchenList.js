import React  from 'react';
import { Box, Container, Grid, makeStyles } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import Page from '../../components/Page';
import TableCard from './KitchenCard';
import { useSelector } from 'react-redux';

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

const KitchenList = () => {
  const classes = useStyles();
  const KitchenState = useSelector(state => state.kitchen);
  const kitchens = (KitchenState && KitchenState.kitchens) || [];
  return (
    <Page className={classes.root} title="Products">
      <Container maxWidth={false}>
        <Box mt={3}>
          <Grid container spacing={3}>
            {kitchens.map(kitchen => (
              <Grid item key={kitchen.id} lg={4} md={6} xs={12}>
                <TableCard className={classes.tableCard} table={kitchen} />
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

export default KitchenList;

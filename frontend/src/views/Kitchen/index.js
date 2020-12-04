import React, { useEffect } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Page from '../../components/Page';
import TableList from './TableList';
import Toolbar from './Toolbar';
import { getTables, hideAlert } from '../../actions';
import AddTable from './AddTable';
import Toast from '../../modules/toast';
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const Branch = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const appState = useSelector(state => state.app);
  const tableState = useSelector(state => state.table);

  if (appState.alert.show) {
    Toast({ message: appState.alert.message });
    dispatch(hideAlert());
  }
  if (tableState && tableState.new) {
    dispatch(getTables());
  }
  useEffect(() => {
    dispatch(getTables());
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

export default Branch;

import React, { useEffect } from 'react';
import { Container, makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Page from '../../components/Page';
import { getTableById, hideAlert } from '../../actions';
import Toast from '../../modules/toast';
import TableView from './Table';
import { useParams } from 'react-router-dom';
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const TableDashBoard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const appState = useSelector(state => state.app);
  const {code} = useParams();
  if (appState.alert.show) {
    Toast({ message: appState.alert.message });
    dispatch(hideAlert());
  }

  useEffect(() => {
    if(code){
      dispatch(getTableById({code}));
    }
  }, [code]);

  return (
    <Page className={classes.root} title="Tables">
      <Container maxWidth={false}>
       <TableView />
      </Container>
    </Page>
  );
};

export default TableDashBoard;

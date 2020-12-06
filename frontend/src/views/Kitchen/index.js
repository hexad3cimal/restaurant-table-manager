import { Box, Container, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getKitchens, hideAlert } from '../../actions';
import Page from '../../components/Page';
import Toast from '../../modules/toast';
import AddKitchen from './AddKitchen';
import KitchenList from './KitchenList';
import Toolbar from './Toolbar';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const Kitchen = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const appState = useSelector(state => state.app);
  const kitchenState = useSelector(state => state.kitchen);

  if (appState.alert.show) {
    Toast({ message: appState.alert.message });
    dispatch(hideAlert());
  }
  if (kitchenState && kitchenState.new) {
    dispatch(getKitchens());
  }
  useEffect(() => {
    dispatch(getKitchens());
  }, []);
  return (
    <Page className={classes.root} title="Kitchens">
      <Container maxWidth={false}>
        {kitchenState && kitchenState.add ? (
          <Box mt={3}>
            <AddKitchen />
          </Box>
        ) : (
          <Box mt={3}>
            <Toolbar />

            <KitchenList />
          </Box>
        )}
      </Container>
    </Page>
  );
};

export default Kitchen;

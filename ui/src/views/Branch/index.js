import React, { useEffect } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Page from '../../components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
import { getBranchesOFOrg } from '../../actions';
import AddBranch from './AddBranch';
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
  const branchState = useSelector(state => state.branch);

  if (branchState.new) {
    dispatch(getBranchesOFOrg());
  }
  useEffect(() => {
    dispatch(getBranchesOFOrg());
  }, []);
  return (
    <Page className={classes.root} title="Branches">
      <Container maxWidth={false}>
        {branchState && branchState.add ? (
          <Box mt={3}>
            <AddBranch />
          </Box>
        ) : (
          <Box mt={3}>
            <Toolbar />

            <Results branches={branchState && branchState.branches} />
          </Box>
        )}
      </Container>
    </Page>
  );
};

export default Branch;

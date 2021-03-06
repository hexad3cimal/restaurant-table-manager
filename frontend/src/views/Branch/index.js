import React, { useEffect } from "react";
import { Box, Button, Container, Grid, makeStyles, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import Page from "../../components/Page";
import Results from "./Results";
import { getBranches, hideAlert, initiateBranchAdd, setBranch } from "../../actions";
import AddBranch from "./AddBranch";
import Toast from "../../modules/toast";
const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const Branch = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const appState = useSelector((state) => state.app);
  const branchState = useSelector((state) => state.branch);
  const branches = (branchState && branchState.branches) || [];
  const userState = useSelector(state => state.user) || {}

  if (appState.alert.show) {
    Toast({ message: appState.alert.message });
    dispatch(hideAlert());
  }

  useEffect(() => {
    dispatch(getBranches());
    dispatch(setBranch(null))
  }, []);
  return (
    <Page className={classes.root} title="Branches">
      <Container maxWidth={false}>
        <Box display="flex" justifyContent="flex-end" style={{ margin: '1rem' }}>
          <Button onClick={() => dispatch(initiateBranchAdd(true))} color="primary" variant="contained">
            Add branch
        </Button>
        </Box>

        {branchState && branchState.add ? (
          <Box mt={3}>
            <AddBranch />
          </Box>
        ) : (
          <Grid container mt={3}>
            {branches.length && userState.user.role === 'admin' ? (
              <Grid item md={12} xs={12}>
                <Results branches={branchState && branchState.branches} />
              </Grid>
            ) : <div></div>}
            {!branches.length && userState.user.role === 'admin' ? (<Typography style={{ margin: '1rem' }} variant="h4">No branches added yet please <Button onClick={() => dispatch(initiateBranchAdd(true))} color="primary" variant="contained">
              Add branch
          </Button></Typography>) : <div></div>}
          </Grid>
        )}
      </Container>
    </Page>
  );
};

export default Branch;

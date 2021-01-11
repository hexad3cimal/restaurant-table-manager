import React, { useEffect } from "react";
import { Box, Button, Container, makeStyles, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import Page from "../../components/Page";
import Results from "./Results";
import Toolbar from "./Toolbar";
import { getBranches, hideAlert, initiateBranchAdd } from "../../actions";
import AddBranch from "./AddBranch";
import Toast from "../../modules/toast";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
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
  if (branchState.new) {
    dispatch(getBranches());
  }
  useEffect(() => {
    dispatch(getBranches());
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
            {branches.length && userState.user.role==='admin' ? (
              <Results branches={branchState && branchState.branches} />
            ) : <div></div>}
            {!branches.length && userState.user.role==='admin' ? (<Typography  style={{margin:'1rem'}} variant="h4">No branches added yet please <Button onClick={()=> dispatch(initiateBranchAdd(true))} color="primary" variant="contained">
            Add branch
          </Button></Typography>): <div></div>}
          </Box>
        )}
      </Container>
    </Page>
  );
};

export default Branch;

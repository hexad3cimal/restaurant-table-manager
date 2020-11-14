import React from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';
import Page from '../../components/Page';
import AddBranch from './AddBranch';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const Account = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="AddBranch">
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item lg={4} md={6} xs={12}>
            <AddBranch />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Account;

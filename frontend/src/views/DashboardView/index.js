import React from "react";
import { Container, Grid, makeStyles } from "@material-ui/core";
import Page from "../../components/Page";
import LatestOrders from "./LatestOrders";
import Orders from "./Orders";
import Cost from "./Cost";
import Products from "./Products";
import { getDashboardStats } from "../../actions";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  dispatch(getDashboardStats())
  return (
    <Page className={classes.root} title="Dashboard">
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={4} sm={4} xl={4} xs={12}>
            <Orders />
          </Grid>
          <Grid item lg={4} sm={4} xl={4} xs={12}>
            <Products />
          </Grid>
          <Grid item lg={4} sm={4} xl={4} xs={12}>
            <Cost />
          </Grid>
          <Grid item md={12}>
            <LatestOrders />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;

import React, { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import Page from "../../components/Page";
import TableList from "./TableList";
import { getTables, hideAlert, initiateTableAdd } from "../../actions";
import AddTable from "./AddTable";
import Toast from "../../modules/toast";
const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const TableView = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const appState = useSelector((state) => state.app);
  const tableState = useSelector((state) => state.table);
  const tables = (tableState && tableState.tables) || [];
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
      <Container maxWidth={true}>
        {tableState && tableState.add ? (
          <Box mt={3}>
            <AddTable />
          </Box>
        ) : (
          <Box mt={3}>
            {tables.length ? (
              <TableList tables={tables} />
            ) : (
              <Typography style={{ margin: "1rem" }} variant="h4">
                No tables added yet please
                <Button
                  onClick={() => dispatch(initiateTableAdd(true))}
                  color="primary"
                  variant="contained"
                >
                  Add Table
                </Button>
              </Typography>
            )}
          </Box>
        )}
      </Container>
    </Page>
  );
};

export default TableView;

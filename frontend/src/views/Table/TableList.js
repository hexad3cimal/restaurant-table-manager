import React from 'react';
import { Box, Container, Grid, makeStyles,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon, } from '@material-ui/core';
  import {  useDispatch, useSelector } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Search as SearchIcon } from 'react-feather';
import Page from '../../components/Page';
import TableCard from './TableCard';
import { initiateTableAdd } from '../../actions';

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

const TableList = () => {
  const classes = useStyles();
  const tableState = useSelector(state => state.table);
  const tables = (tableState && tableState.tables) || [];
  const dispatch = useDispatch();

  return (
    <Page className={classes.root} title="Products">
      <Container maxWidth={false}>
      <Box display="flex" justifyContent="flex-end">
        <Button onClick={() => dispatch(initiateTableAdd())} color="primary" variant="contained">
          Add Table
        </Button>
      </Box>
      <Box mt={3}>
        <Card>
          <CardContent>
            <Box maxWidth={500}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon fontSize="small" color="action">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                placeholder="Search Table"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
        <Box mt={3}>
        <PerfectScrollbar>
          <Grid container spacing={3}>
            {tables.map(table => (
              <Grid item key={table.id} lg={4} md={6} xs={12}>
                <TableCard className={classes.tableCard} table={table} />
              </Grid>
            ))}
          </Grid>
          </PerfectScrollbar>
        </Box>
      </Container>
    </Page>
  );
};

export default TableList;

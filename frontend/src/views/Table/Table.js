import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  makeStyles,
  Container
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import Order from './Order';
import { getProducts, initiateOrderAdd } from '../../actions';


const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100,
  },
}));

const Table = ({ className, ...rest }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const appState = useSelector(state => state.app);
  const orderState = useSelector(state => state.order);
  const tableState = useSelector(state => state.table);
  const table= tableState && tableState.selectedTable || {}

  const onClick = () => {
    dispatch(getProducts())
    dispatch(initiateOrderAdd())
  }
  return (
    <Container maxWidth={false}>

      {
         orderState && orderState.add?( <Order table={table} />) :
        (<Card className={clsx(classes.root, className)} {...rest}>
        <CardContent>
        <Box alignItems="center" display="flex" flexDirection="column">
          {/* <Avatar className={classes.avatar} src={user.avatar} /> */}
          <Typography color="textPrimary" gutterBottom variant="h3">
            {table.name}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            {`${table.branchName}`}
          </Typography>
         
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button color="primary"  onClick={() => {onClick()}} fullWidth variant="text">
          Place order
        </Button>
      </CardActions>
      </Card>)
    }
    </Container>

  );
};

Table.propTypes = {
  className: PropTypes.string,
};

export default Table;

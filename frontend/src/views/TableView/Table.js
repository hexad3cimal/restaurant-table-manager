import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  makeStyles,
  Container,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import Order from './Order';
import { getOrderByTableId, getProducts, getTopProductsOfBranch, initiateOrderAdd } from '../../actions';


const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100,
  },
}));

const TableView = ({ className, ...rest }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const orderState = useSelector(state => state.order);
  const tableState = useSelector(state => state.table);
  const table= tableState && tableState.selectedTable || {}

  useEffect(()=>{
    if(table.id){
      dispatch(getOrderByTableId(table.id))
      dispatch(getTopProductsOfBranch())

    }
  },[dispatch, table && table.id])
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
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderState && orderState.orders.map(order => (
                <TableRow
                  hover
                  key={order.id}
                >
                 
                  <TableCell>
                    <Box alignItems="center" display="flex">
              
                      <Typography color="textPrimary" variant="body1">
                        {order.productName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{order.note}</TableCell>
                  <TableCell>{order.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

TableView.propTypes = {
  className: PropTypes.string,
};

export default TableView;

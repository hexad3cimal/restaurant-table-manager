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
  Table,
  IconButton,
  Collapse
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Order from './Order';
import { getOrderByTableId, getProducts, initiateOrderAdd } from '../../actions';


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
  const orderState = useSelector(state => state.order) || {};
  const tableState = useSelector(state => state.table);
  const table= tableState && tableState.selectedTable || {}
  const orders = orderState.orders || []
  const activeOrders = orders.map( (order) => {
    return order.orderItems
  }).reduce( (item1,item2) => {return item1.concat(item2)},[])

  const [openRowProductId, setOpenRowProductId] = React.useState({ id: null });
  const toggleProductRow = (item) => {
    if (openRowProductId === item.id) setOpenRowProductId(null);
    else setOpenRowProductId(item.id);
  };
  useEffect(()=>{
    if(table.id){
      dispatch(getOrderByTableId(table.id))
    }

  },[dispatch, table])
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
                <TableCell>Price</TableCell>
                <TableCell>Addons</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activeOrders.map(order => (
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
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.price}</TableCell>
                  <TableCell>
                                    <IconButton
                                      aria-label="expand row"
                                      size="small"
                                      onClick={() => toggleProductRow(order)}
                                    >
                                      {openRowProductId === order.id ? (
                                        <KeyboardArrowUpIcon />
                                      ) : (
                                        <KeyboardArrowDownIcon />
                                      )}
                                    </IconButton>{" "}
                                    Addons
                                    <Collapse
                                      in={openRowProductId === order.id}
                                      timeout="auto"
                                      unmountOnExit
                                    >
                                      <Box margin={1}>
                                        <Typography
                                          variant="h6"
                                          gutterBottom
                                          component="div"
                                        >
                                          Customisations
                                        </Typography>
                                        <Table
                                          size="small"
                                          aria-label="purchases"
                                        >
                                          <TableHead>
                                            <TableRow>
                                              <TableCell>Name</TableCell>
                                              <TableCell align="right">
                                                Amount
                                              </TableCell>
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            {order.customisations.length ? (
                                              order.customisations.map(
                                                (item) => (
                                                  <TableRow key={item.id}>
                                                    <TableCell
                                                      component="th"
                                                      scope="row"
                                                    >
                                                      {item.name}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                      {item.price}
                                                    </TableCell>
                                                  </TableRow>
                                                )
                                              )
                                            ) : (
                                              <Typography
                                                variant="h6"
                                                gutterBottom
                                                component="div"
                                              >
                                                No Customisations added
                                              </Typography>
                                            )}
                                          </TableBody>
                                        </Table>
                                      </Box>
                                    </Collapse>
                                  </TableCell>
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

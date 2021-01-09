import React, { useEffect } from "react";
import moment from "moment";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  makeStyles,
  Typography,
} from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../../actions/order";

const useStyles = makeStyles(() => ({
  root: { display: "flex", flexDirection: "column" },
  noOrder: { alignSelf: "center", margin: "5rem" },
}));

const LatestOrders = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const orderState = useSelector((state) => state.order) || {};
  const orders = (orderState && orderState.orders) || [];

  useEffect(() => {
    dispatch(getOrders());
  }, []);
  return (
    <Card className={classes.root}>
      <CardHeader title="Latest Orders" />
      <Divider />
      {orders.length > 0 ? (
        <PerfectScrollbar>
          <Box minWidth={800}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order Ref</TableCell>
                  <TableCell>Branch</TableCell>
                  <TableCell>Kitchen</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell sortDirection="desc">
                    <Tooltip enterDelay={300} title="Sort">
                      <TableSortLabel active direction="desc">
                        Date
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow hover key={order.id}>
                    <TableCell>{order.refCode}</TableCell>
                    <TableCell>{order.branchName}</TableCell>
                    <TableCell>{order.kitchenName}</TableCell>
                    <TableCell>{order.productName}</TableCell>
                    <TableCell>
                      {moment(order.CreatedAt).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell>
                      <Chip color="primary" label={order.status} size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box display="flex" justifyContent="flex-end" p={2}>
              <Button
                color="primary"
                endIcon={<ArrowRightIcon />}
                size="small"
                variant="text"
              >
                View all
              </Button>
            </Box>
          </Box>
        </PerfectScrollbar>
      ) : (
        <Typography variant="h3" className={classes.noOrder}>
          No orders yet
        </Typography>
      )}
    </Card>
  );
};

LatestOrders.propTypes = {
  className: PropTypes.string,
};

export default LatestOrders;

import React, { useEffect } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  makeStyles,
  Container,
  TableRow,
  TableCell,
  TableBody,
  Table,
  IconButton,
  Collapse,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { getOrders, updateOrder } from "../../actions";

const useStyles = makeStyles((theme) => ({
  root: { width: "100%", display: "flex", flexDirection: "column" },
  productName: {
    color: theme.palette.text.primary,
    fontSize: "1.6rem",
    fontWeight: "750",
    lineHeight: "1.8rem",
  },
  card: {
    marginBottom: ".7rem",
    "&:hover": {
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    },
  },
  content: {
    display: "flex",
    flexDirection: "column",
  },
  price: {
    color: theme.palette.text.primary,
    fontSize: "1rem",
    margin: ".5rem",
  },
  quantity: {
    color: theme.palette.text.primary,
    fontSize: "1rem",
    margin: ".5rem",
  },
  status: {
    color: theme.palette.text.primary,
    fontSize: "1rem",
    margin: ".5rem",
    background: "yellow",
    fontWeight: "600",
  },
  detailsBox: {
    display: "flex",
    flexDirection: "row",
  },
  topButton: {
    alignSelf: "center",
    width: "15rem",
  },
}));

const KitchenView = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const orderState = useSelector((state) => state.order) || {};
  const orders = orderState.orders || [];

  const handleStatusChange = (event, orderItem) => {
    const orderItemClone = Object.assign({}, orderItem);
    orderItemClone.status = event.target.value;
    dispatch(updateOrder(orderItemClone));
  };
  const [openRowProductId, setOpenRowProductId] = React.useState({ id: null });
  const toggleProductRow = (item) => {
    if (openRowProductId === item.id) setOpenRowProductId(null);
    else setOpenRowProductId(item.id);
  };
  useEffect(() => {
    dispatch(getOrders());
  }, []);

  return (
    <Container maxWidth={true}>
      <Grid item xs={12} className={classes.content}>
        <CardContent className={classes.root}>
          {orders.map((order) => (
            <Card className={classes.card} key={order.id}>
              <CardContent>
                <Typography gutterBottom className={classes.productName}>
                  {order.productName}
                </Typography>
                <Box className={classes.detailsBox}>
                  <Typography className={classes.price}>
                    Rs {order.price}
                  </Typography>
                  <Typography className={classes.quantity}>
                    {order.quantity} Nos
                  </Typography>

                  <FormControl variant="filled" className={classes.status}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={order.status}
                      onChange={(event) => {
                        handleStatusChange(event, order);
                      }}
                    >
                      <MenuItem value={"ordered"}>Ordered</MenuItem>
                      <MenuItem value={"preparing"}>Preparing</MenuItem>
                      <MenuItem value={"serve"}>Ready to serve</MenuItem>
                      <MenuItem value={"complete"}>Complete</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box>
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
                      <Typography variant="h6" gutterBottom component="div">
                        Customisations
                      </Typography>
                      <Table size="small" aria-label="customisations">
                        <TableBody>
                          {order.customisations &&
                          order.customisations.length ? (
                            order.customisations.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell component="th" scope="row">
                                  {item.name}
                                </TableCell>
                                <TableCell align="right">
                                  {item.price}
                                </TableCell>
                              </TableRow>
                            ))
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
                </Box>
              </CardContent>
              <Divider />
            </Card>
          ))}
        </CardContent>
        <Divider />
        <CardActions></CardActions>
      </Grid>
    </Container>
  );
};

export default KitchenView;

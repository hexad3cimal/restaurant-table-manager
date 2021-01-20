import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles,
  Avatar,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Button,
} from "@material-ui/core";
import { Search as SearchIcon } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import Page from "../../components/Page";
import {
  hideAlert,
  initiateProductAdd,
  setProductInState,
  deleteProduct,
} from "../../actions";

const useStyles = makeStyles((theme) => ({
  root: {overflowX:'scroll'},
  avatar: {
    marginRight: theme.spacing(2),
  },
  action:{
    display:'flex',
    flexDirection:'column'
  },
  actionButton:{
    width:'10rem',
    marginBottom:'.7rem'
  }
}));

const ProductList = () => {
  const classes = useStyles();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const dispatch = useDispatch();

  const [tableRows, setTableRows] = useState([]);
  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    setTableRows(
      filteredProducts.slice(
        newPage * limit,
        newPage * limit + limit > filteredProducts.length
          ? filteredProducts.length
          : newPage * limit + limit
      )
    );
  };

  const productState = useSelector((state) => state.product);
  const products = (productState && productState.products) || [];

  const [filteredProducts, setProducts] = useState([]);

  useEffect(() => {
    setProducts(products);
    setTableRows(products);
  }, [products]);
  const onSearch = (value) => {
    setProducts(
      products.filter((product) => {
        return product.name.toLowerCase().includes(value);
      })
    );
  };
  const onEdit = (product) => {
    dispatch(setProductInState(product));
    dispatch(initiateProductAdd(true));
  };
  const onDelete = (branch) => {
    dispatch(deleteProduct(branch));
    setTimeout(() => {
      dispatch(hideAlert());
    }, 100);
  };

  useEffect(() => {
    setTableRows(filteredProducts.slice(0, limit));
  }, [limit]);

  useEffect(() => {
    setTableRows(filteredProducts.slice(0, limit));
  }, [filteredProducts]);
  return (
    <Page title="Products">
      {products.length ? (
          <Box mt={3}>
            <Card className={classes.root}>
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
                        placeholder="Search with product name"
                        variant="outlined"
                        onChange={(event) => {
                          onSearch(event.target.value.toLowerCase());
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
              <PerfectScrollbar>
                <Box>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Tags</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableRows.map((product) => (
                        <TableRow hover key={product.id}>
                          <TableCell>
                            <Box alignItems="center" display="flex">
                              <Avatar
                                className={classes.avatar}
                                src={product.image}
                              ></Avatar>
                              <Typography color="textPrimary" variant="body1">
                                {product.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{product.price}</TableCell>
                          <TableCell>{product.description}</TableCell>
                          <TableCell>
                            {product.tags &&
                              product.tags.map((tag) => tag.name).join(",")}
                          </TableCell>
                          <TableCell className={classes.action}>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => onEdit(product)}
                              className={classes.actionButton}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => onDelete(product)}
                              className={classes.actionButton}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </PerfectScrollbar>
              <TablePagination
                component="div"
                count={products.length}
                onChangePage={(event, newPage) =>
                  handlePageChange(event, newPage)
                }
                onChangeRowsPerPage={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </Card>
          </Box>
      ) : (
        <Typography style={{ margin: "1rem" }} variant="h4">
          No products added yet please
          <Button
            onClick={() => dispatch(initiateProductAdd(true))}
            color="primary"
            variant="contained"
          >
            Add Products
          </Button>
        </Typography>
      )}
    </Page>
  );
};

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
};

export default ProductList;

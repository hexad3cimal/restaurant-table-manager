import React, {
  useEffect,
  useState,
  //useState
} from "react";
import PropTypes from "prop-types";

import {
  Box,
  Card,
  CardContent,
  //Button,
  //Card,
  //CardContent,
  //Divider,
  //Container,
  //CardHeader,
  Grid,
  InputAdornment,
  SvgIcon,
  TextField,
  // TextField,
} from "@material-ui/core";
import { Search as SearchIcon } from "react-feather";

import { useDispatch, useSelector } from "react-redux";
import { getTopProductsOfBranch } from "../../actions";
import Slider from "./Slider";
import ProductCard from "./ProductCard";
import Cart from "./Cart";

const Order = ({ className, table, ...rest }) => {
  const dispatch = useDispatch();
  const productState = useSelector((state) => state.product);
  const [products, setProducts] = useState([]);
  // const tableState = useSelector((state) => state.table);
  const branchState = useSelector((state) => state.branch);
  const topProductsOfBranch = (branchState && branchState.topProducts) || [];
  const productsInState = (productState && productState.products) || [];
  // const [product, setProduct] = useState(null);
  // const onTopProductClick = (product) => {
  //   setProduct(product.id)
  // };
  const handleSearch = (value) => {
    setProducts(
      productsInState.filter((product) => {
        return product.name.toLowerCase().includes(value.toLowerCase());
      })
    );
  };

  useEffect(() => {
    dispatch(getTopProductsOfBranch());
  }, []);

  useEffect(() => {
    handleSearch("");
  }, [productsInState]);

  return (
    <Grid container spacing={3}>
      <Grid lg={12}>
        <Slider items={topProductsOfBranch} />
      </Grid>
      <Grid lg={8}>
        <Box>
          <Card style={{ marginBottom: "1rem" }}>
            <CardContent>
              <Box>
                <TextField
                  fullWidth
                  onChange={(event) => {
                    handleSearch(event.target.value);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon fontSize="small" color="action">
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Search for dishes"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
        {products.map((p) => {
          return <ProductCard product={p} />;
        })}
      </Grid>
      <Grid lg={4}>
        <Cart />
      </Grid>
    </Grid>
  );
};

Order.propTypes = {
  className: PropTypes.string,
};

export default Order;

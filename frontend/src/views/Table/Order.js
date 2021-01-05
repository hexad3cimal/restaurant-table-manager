import React, {
  useEffect,
  useRef,
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
  Typography,
  // TextField,
} from "@material-ui/core";
import { Search as SearchIcon } from "react-feather";
import { getRandomNumber } from "../../modules/helpers";

import { useDispatch, useSelector } from "react-redux";
import { getTopProductsOfBranch } from "../../actions";
import Slider from "./Slider";
import ProductCard from "./ProductCard";
import Cart from "./Cart";

const Order = ({ className, table, ...rest }) => {
  const dispatch = useDispatch();
  const productState = useSelector((state) => state.product);
  const [products, setProducts] = useState([]);
  let colorArrayRef = useRef([])
  // const tableState = useSelector((state) => state.table);
  const branchState = useSelector((state) => state.branch);
  const topProductsOfBranch = (branchState && branchState.topProducts) || [];
  const productsInState = (productState && productState.products) || [];
  // const [product, setProduct] = useState(null);
  // const onTopProductClick = (product) => {
  //   setProduct(product.id)
  // };
  if(colorArrayRef.current.length === 0)colorArrayRef.current= getRandomNumber(4)
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
    <Grid container>
      <Grid spacing={3} xs={12}>
        <Typography
          align="center"
          color="textPrimary"
          gutterBottom
          variant="h4"
        >
          Top ordered dishes
        </Typography>
        <Slider items={topProductsOfBranch} />
      </Grid>
      <Grid lg={7} style={{ margin: "1rem" }}>
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
        <Grid
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >
          {products.map((p,i) => {
            return (
              <Grid lg={6} xs={12}>
                <ProductCard key={p.id} product={p} index={colorArrayRef.current[i%4]} />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
      <Grid style={{ marginTop: "1rem" }} lg={4}>
        <Cart />
      </Grid>
    </Grid>
  );
};

Order.propTypes = {
  className: PropTypes.string,
};

export default Order;

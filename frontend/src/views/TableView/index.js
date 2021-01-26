import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  SvgIcon,
  TextField,
} from "@material-ui/core";
import { Search as SearchIcon } from "react-feather";

import { useDispatch, useSelector } from "react-redux";
import { getTopProductsOfBranch } from "../../actions";
import ProductCard from "../Table/ProductCard";
import Cart from "../Table/Cart";
const useStyles = makeStyles((theme) => ({
  sortBy: {
    width: "10rem",
  },
  helperBox: {
    display: "flex",
    flexDirection: "row",
    marginTop: "1rem",
    justifyContent: "space-between",
  },
  button:{
    width:'9rem'
  }
}));

const TableDashboard = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const productState = useSelector((state) => state.product);
  const [products, setProducts] = useState([]);
  const sortBy = useRef('');
  const searchBy = useRef('');

  const branchState = useSelector((state) => state.branch);
  const topProductsOfBranch = (branchState && branchState.topProducts) || [];
  const productsInState = (productState && productState.products) || [];
  const handleSearch = (value) => {
    searchBy.current = value;
    setProducts(
      productsInState.filter((product) => {
        return product.name.toLowerCase().includes(value.toLowerCase());
      })
    );
  };

  const sortItems = (sort) => {
    let productsClone = products.slice(0);
    sortBy.current = sort;
   if(productsClone.length >1){
    if (searchBy.current) {
      productsClone = productsClone.filter((product) => {
        return product.name
          .toLowerCase()
          .includes(searchBy.current.toLowerCase());
      });
    }
    switch (sort) {
      case "ascending":
        setProducts(
          productsClone.sort((prod1, prod2) =>
            prod1.price - prod2.price
          )
        );
        break;
      case "descending":
        setProducts(
          productsClone.sort((prod1, prod2) =>
            prod2.price - prod1.price
          )
        );
        break;
      default:
        break;
    }
   }
   
  };

  const handleTopProductsClick = () => {
    setProducts(topProductsOfBranch);
  };

  useEffect(() => {
    dispatch(getTopProductsOfBranch());
  }, []);

  useEffect(() => {
    handleSearch("");
   setProducts(productsInState)
  }, [productsInState]);

  return (
    <Grid container maxWidth={true}>
      <Grid style={{ marginRight: "1rem" }} item lg={7}>
        <Box>
          <Card style={{ marginBottom: "1rem" }}>
            <CardContent>
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
                value={searchBy.current}
              />
              <Box className={classes.helperBox}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleTopProductsClick();
                  }}
                  className={classes.button}
                >
                  Top ordered
                </Button>
                <FormControl className={classes.sortBy} variant="outlined">
                  <InputLabel id="demo-simple-select-outlined-label">
                    Sort by
                  </InputLabel>
                  <Select
                    value={sortBy.current}
                    onChange={(event) => {
                      sortItems(event.target.value);
                    }}
                    label="Sort by"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"ascending"}>Price low to high</MenuItem>
                    <MenuItem value={"descending"}>Price high to low</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Grid
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >
          {products.map((p, index) => 
            (
              <Grid item   key={p.id+index} lg={6} xs={12}>
                <ProductCard product={p} />
              </Grid>
            )
          )}
        </Grid>
      </Grid>
      <Grid item style={{ marginTop: "5rem" }} lg={4}>
        <Cart />
      </Grid>
    </Grid>
  );
};

TableDashboard.propTypes = {
  className: PropTypes.string,
};

export default TableDashboard;

import React, { useEffect, useState,
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
import { Search as SearchIcon } from 'react-feather';

import { useDispatch, useSelector } from "react-redux";
import { //addOrder, 
  getTopProductsOfBranch } from "../../actions";
import Slider from "./Slider";
import ProductCard from "./ProductCard";

const Order = ({ className, table, ...rest }) => {

  const dispatch = useDispatch();
  const productState = useSelector((state) => state.product);
  const[products,setProducts] = useState([])
  // const tableState = useSelector((state) => state.table);
  const branchState = useSelector((state) => state.branch);
  const topProductsOfBranch = (branchState && branchState.topProducts) || [];
  const productsInState = (productState && productState.products) || [];
  // const [product, setProduct] = useState(null);
  // const onTopProductClick = (product) => {
  //   setProduct(product.id)
  // };
  const handleSearch = (value) => {
    setProducts(productsInState.filter( product => {
      return product.name.toLowerCase().includes(value.toLowerCase())
    }))
  }

  useEffect(() => {
    dispatch(getTopProductsOfBranch());
  }, []);

  useEffect(() => {
    handleSearch('')
  }, [productsInState]);

  return (
    <Box
      height="100%"
      width="100%"
    >
        <Grid lg={12}>
          <Slider items={topProductsOfBranch} />
        </Grid>
        <Grid lg={12}>
        <Box mt={3}>
        <Card style={{marginBottom:'1rem'}}>
          <CardContent>
            <Box>
              <TextField
                fullWidth
                onChange={(event)=>{handleSearch(event.target.value)}}
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
       {products.map(p=>{
         return <ProductCard product={p} />
       })}
        </Grid>
        
    </Box>
  );
};

Order.propTypes = {
  className: PropTypes.string,
};

export default Order;

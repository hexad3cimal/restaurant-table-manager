import React, { useEffect,
   //useState 
  } from "react";
import PropTypes from "prop-types";

import {
  Box,
  //Button,
  //Card,
  //CardContent,
  //Divider,
 //Container,
  //CardHeader,
  Grid,
 // TextField,
} from "@material-ui/core";

import { useDispatch, useSelector } from "react-redux";
import { //addOrder, 
  getTopProductsOfBranch } from "../../actions";
import Slider from "./Slider";
import ProductCard from "./ProductCard";

const Order = ({ className, table, ...rest }) => {
  useEffect(() => {
    dispatch(getTopProductsOfBranch());
  }, []);
  const dispatch = useDispatch();
  const productState = useSelector((state) => state.product);
  // const tableState = useSelector((state) => state.table);
  const branchState = useSelector((state) => state.branch);
  const topProductsOfBranch = (branchState && branchState.topProducts) || [];
  const products = (productState && productState.products) || [];
  // const [product, setProduct] = useState(null);
  // const onTopProductClick = (product) => {
  //   setProduct(product.id)
  // };
  return (
    <Box
      display="flex"
      flexDirection="row"
      height="100%"
      justifyContent="center"
      flexWrap="row"
      width="100%"
    >
        <Grid md={12} xs={12}>
          <Slider products={topProductsOfBranch} />
        </Grid>
        <Grid md={12} xs={12}>
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

import React from 'react';
import { useDispatch } from 'react-redux';

import {
  Box,
  Button,
} from '@material-ui/core';
import {  initiateProductAdd } from '../../actions';


const Toolbar = () => {
  const dispatch = useDispatch();

  return (
      <Box display="flex" justifyContent="flex-end">
        <Button onClick={() => {dispatch(initiateProductAdd(true))}} color="primary" variant="contained">
          Add Product
        </Button>
      </Box>
   
  );
};



export default Toolbar;

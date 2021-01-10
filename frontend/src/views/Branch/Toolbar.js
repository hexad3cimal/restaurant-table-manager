import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import {
  Box,
  Button,
} from '@material-ui/core';
import {initiateBranchAdd} from '../../actions';

const Toolbar = ({ className, ...rest }) => {
  const dispatch = useDispatch();

  return (
      <Box display="flex" justifyContent="flex-end" style={{margin:'1rem'}}>
        <Button onClick={()=> dispatch(initiateBranchAdd(true))} color="primary" variant="contained">
          Add branch
        </Button>
      </Box>

  );
};

Toolbar.propTypes = {
  className: PropTypes.string,
};

export default Toolbar;

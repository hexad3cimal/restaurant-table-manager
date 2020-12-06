import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import {
  Box,
  Button,

  makeStyles,
} from '@material-ui/core';
import {initiateBranchAdd} from '../../actions';
const useStyles = makeStyles(theme => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1),
  },
  exportButton: {
    marginRight: theme.spacing(1),
  },
}));

const Toolbar = ({ className, ...rest }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
      <Box display="flex" justifyContent="flex-end">
        <Button className={classes.importButton}>Import</Button>
        <Button className={classes.exportButton}>Export</Button>
        <Button onClick={()=> dispatch(initiateBranchAdd())} color="primary" variant="contained">
          Add branch
        </Button>
      </Box>

  );
};

Toolbar.propTypes = {
  className: PropTypes.string,
};

export default Toolbar;

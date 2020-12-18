import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  makeStyles,
  Button,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { selectedTable ,updateTable} from '../../actions/';
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  statsItem: {
    alignItems: 'center',
    display: 'flex',
  },
  statsIcon: {
    marginRight: theme.spacing(1),
  },
  occupied: {
    backgroundColor: theme.colors.red.main,
  },
}));

const TableCard = ({ className, table, ...rest }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onClick = (table) =>{
    dispatch(selectedTable(table))
    navigate("/app/table-details", { replace: true })
  }
  const generateNewCode = (table) =>{
    table.loginCode = uuidv4()
    dispatch(updateTable(table))
  }

  return (
    <Card
      className={clsx(classes.root, className, table.occupied ? classes.occupied : null)}
      {...rest}
    >
      <CardContent >
        {/* <Box display="flex" justifyContent="center" mb={3}>
          <Avatar alt="Product" src={product.media} variant="square" />
        </Box> */}
        <Typography align="center" color="textPrimary" gutterBottom variant="h4">
          {table.name}
        </Typography>
        <Typography align="center" color="textPrimary" variant="body1">
          {table.branchName}
        </Typography>
      </CardContent>
      <Box flexGrow={1} />
      <Divider />
      <Box p={2}>
        <Grid container justify="space-between" spacing={2}>
        <Typography align="center" color="textPrimary" variant="body1">
          Login code
        </Typography>
        <Typography align="center" color="textPrimary" variant="body1">
          {table.loginCode}
        </Typography>
        </Grid>
      </Box>
      <Divider />
      <Box p={2}>
        <Grid container justify="space-between" spacing={2}>
        <Button onClick={() => {onClick(table)}} color="primary" variant="contained">
          View
        </Button>
        <Button onClick={() => {generateNewCode(table)}} color="primary" variant="contained">
          Generate new code
        </Button>
        </Grid>
      </Box>
    </Card>
  );
};

TableCard.propTypes = {
  className: PropTypes.string,
  table: PropTypes.object.isRequired,
};

export default TableCard;

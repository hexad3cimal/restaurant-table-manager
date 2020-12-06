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
} from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { useDispatch } from 'react-redux';
import { selectedTable } from '../../actions/table';
import { useNavigate } from "react-router-dom";
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
  return (
    <Card
      className={clsx(classes.root, className, table.occupied ? classes.occupied : null)}
      {...rest}
    >
      <CardContent onClick={() => {onClick(table)}}>
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
          <Grid className={classes.statsItem} item>
            <AccessTimeIcon className={classes.statsIcon} color="action" />
            <Typography color="textSecondary" display="inline" variant="body2">
              Updated 2hr ago
            </Typography>
          </Grid>
          {/* <Grid className={classes.statsItem} item>
            <GetAppIcon className={classes.statsIcon} color="action" />
            <Typography color="textSecondary" display="inline" variant="body2">
              {product.totalDownloads} Downloads
            </Typography>
          </Grid> */}
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

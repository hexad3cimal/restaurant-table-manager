import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  Button,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { deleteKitchen, setKitchenInState } from '../../actions';
import { Bounce } from 'react-awesome-reveal';
import AddKitchen from './AddKitchen';


const KitchenCard = ({ kitchen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const kitchenState = useSelector((state) => state.kitchen);
  const selectedKitchenFromState = (kitchenState && kitchenState.selectedKitchen) || {};
  
  const onClick = (kitchen) =>{
    dispatch(setKitchenInState(kitchen))
    navigate("/app/kitchen", { replace: true })
  }
  const onEdit = (kitchen) =>{
    dispatch(setKitchenInState(kitchen))
  }
  const onDelete = (kitchen) =>{
    dispatch(deleteKitchen(kitchen))
  }
  return (
    <Bounce>
    {!selectedKitchenFromState.id ? 
    <Card
    >
      <CardContent onClick={() => {onClick(kitchen)}}>
        <Typography align="center" color="textPrimary" gutterBottom variant="h4">
          {kitchen.name}
        </Typography>
        <Typography align="center" color="textPrimary" variant="body1">
          {kitchen.branchName}
        </Typography>
      </CardContent>
      <Box flexGrow={1} />
      <Divider />
      <Box p={2}>
        <Grid container justify="space-between" spacing={2}>
        <Button onClick={() => {onClick(kitchen)}} color="primary" variant="contained">
          View
        </Button>
        <Button onClick={() => {onEdit(kitchen)}} color="primary" variant="contained">
          Edit
        </Button>
        <Button onClick={() => {onDelete(kitchen)}} color="secondary" variant="contained">
          Delete
        </Button>
        </Grid>
      </Box>
    </Card> : <AddKitchen /> }
    </Bounce>
  );
};

KitchenCard.propTypes = {
  className: PropTypes.string,
  table: PropTypes.object.isRequired,
};

export default KitchenCard;

import React, { useEffect, useState }  from 'react';
import { Box, Button, Card, CardContent, Container, Grid, InputAdornment, makeStyles, SvgIcon, TextField, Typography } from '@material-ui/core';
import Page from '../../components/Page';
import { useDispatch, useSelector } from 'react-redux';
import KitchenCard from './KitchenCard';
import { Search as SearchIcon } from 'react-feather';
import { initiateKitchenAdd } from '../../actions';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  tableCard: {
    height: '100%',
  },
}));

const KitchenList = () => {
  const dispatch = useDispatch();

  const classes = useStyles();
  const KitchenState = useSelector(state => state.kitchen);
  const kitchens = (KitchenState && KitchenState.kitchens) || [];

  const [filteredKitchens, setKitchens]= useState([])

  useEffect(()=>{setKitchens(kitchens)},[kitchens])
  const onSearch = (value)=>{
    setKitchens(kitchens.filter(kitchen=>{
      return kitchen.name.toLowerCase().includes(value)
    }))
  }

  return (
    <Page className={classes.root} title="Kitchens">
        {
          kitchens.length ? 
          <Container maxWidth={false}>

      <Box mt={3}>
        <Card>
          <CardContent>
            <Box maxWidth={500}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon fontSize="small" color="action">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                placeholder="Search with kitchen name"
                variant="outlined"
                onChange={(event)=>{onSearch(event.target.value.toLowerCase())}}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
        <Box mt={3}>
          <Grid container spacing={3}>
            {filteredKitchens.map(kitchen => (
              <Grid item key={kitchen.id} lg={4} md={6} xs={12}>
                <KitchenCard className={classes.tableCard} kitchen={kitchen} />
              </Grid>
            ))}
          </Grid>
        </Box>
        </Container>

         : (
              <Typography style={{ margin: "1rem" }} variant="h4">
                No kitchens added yet please
                <Button
                  onClick={() => dispatch(initiateKitchenAdd(true))}
                  color="primary"
                  variant="contained"
                >
                  Add Kitchen
                </Button>
              </Typography>
            )
         }
    </Page>
  );
};

export default KitchenList;

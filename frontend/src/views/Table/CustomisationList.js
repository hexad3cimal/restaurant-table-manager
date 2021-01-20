import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { Box, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    display:'flex',
    flexDirection:'column',
  },
  buttonBox:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'flex-end'
  }
}));

export default function CustomisationList({customisations, onSelect, onDone, selected}) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value)=> {
    const currentIndex = checked.indexOf(value.id);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value.id);
      onSelect(value,'add')
    } else {
      newChecked.splice(currentIndex, 1);
      onSelect(value,'remove')
    }

    setChecked(newChecked);
  };

  useEffect(()=>{
    selected.forEach(customisation =>{
    if(customisation.id)
        handleToggle(customisation)
    })
  },[selected])

  return (
    <List className={classes.root}>
      {customisations.map((customisation) => {
        const labelId = `checkbox-list-label-${customisation.id}`;

        return (
          <ListItem key={customisation.id} role={undefined} dense button onClick={()=>{handleToggle(customisation)}}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(customisation.id) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemText primary={customisation.name} />
            <ListItemText  primary={customisation.description} />
            <ListItemSecondaryAction>
            <ListItemText  primary={customisation.price} />
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
      <Box className={classes.buttonBox}>
      <Button onClick={()=>{onDone(false)}}variant="contained">Done</Button>
      </Box>
    </List>
  );
}

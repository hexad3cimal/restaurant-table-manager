import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import AdjustIcon from '@material-ui/icons/Adjust';
import { Box, Button } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function Customisation({ item, onEdit, onDelete }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box>
      <ListItem button >
        <ListItemIcon onClick={handleClick}>
        {open ? <ExpandLess /> : <span><ExpandMore /></span>}
        </ListItemIcon>
        <ListItemText onClick={handleClick} primary={item.title} />{" "}
        <Button
                      variant={"contained"}
                      color="primary"
                      margin="normal"
                      onClick = {()=> onEdit(item)}
                      
                    >
                      Edit
                    </Button>
                    <Button
                      variant={"contained"}
                      color="secondary"
                      margin="normal"
                      onClick = {()=> onDelete(item)}
                      
                    >
                      Delete
                    </Button>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <AdjustIcon />
              </ListItemIcon>
              <ListItemText primary={item.itemDescription} />
              <ListItemText primary={item.itemPrice} />
            </ListItem>
          </List>
      </Collapse>
    </Box>
  );
}

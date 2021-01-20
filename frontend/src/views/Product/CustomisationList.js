import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import Customisation from "./Customisation";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function CustomisationList({ list, onEdit, onDelete }) {
  const classes = useStyles();
  return (
    <Grid item xs={12}>
      <List
        component="nav"
        aria-labelledby="customisations-list"
        subheader={
          <ListSubheader component="div">
            Customisations
          </ListSubheader>
        }
        className={classes.root}
      >
        {list.map((item) => (
          <Customisation key={item.id} onEdit={onEdit} onDelete={onDelete} item={item} />
        ))}
      </List>
    </Grid>
  );
}

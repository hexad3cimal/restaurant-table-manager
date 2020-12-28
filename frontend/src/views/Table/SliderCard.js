import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width:'25%'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
  }
}));

export default function SliderCard({item}) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
          {item.name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
          {item.description}
          </Typography>
        </CardContent>
      </div>
      <CardMedia
        className={classes.cover}
        image={item.image}
        title={item.name}
      />
    </Card>
  );
}

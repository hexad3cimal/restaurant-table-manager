import React from "react";
import Carousel from "react-material-ui-carousel";

import { Card, CardMedia, Typography, Grid, Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    banner: { height: "15rem", position: "relative" },
    bannerGrid: { height: "80%" },
    media: {
      backgroundColor: "white",
      height: "100%",
      overflow: "hidden",
      position: "relative",
    },
    mediaCaption: {
      textOverflow: "ellipsis",
      position: "absolute",
      bottom: 0,
      backgroundColor: "black",
      color: "white",
      opacity: " 0.6",
      width: "100%",
      height: "15%",
      font: {
        size: "2rem",
        weight: 200,
      },

      transition: "300ms",
      cursor: "pointer",
    },
  }));
function Banner(props) {
  const totalItems = props.item.length ? props.item.length : 0;

  let items = [];

  const styles = useStyles()

  for (let i = 0; i < totalItems; i++) {
    const item = props.item[i];

    const media = (
      <Grid item key={item.name}>
        <CardMedia
          className={styles.media}
          image={item.image}
          title={item.name}
        >
          <Typography className={styles.mediaCaption}>{item.name}</Typography>
        </CardMedia>
        <Button
          variant="outlined"
          onClick={() => props.onClick(item)}
          className="ViewButton"
        >
          Add to order 
        </Button>
      </Grid>
    );

    items.push(media);
  }

  return (
    <Card style={{ margin: "1rem" }} raised className={styles.banner}>
      <Grid
        style={{ margin: "1rem" }}
        container
        spacing={6}
        className={styles.bannerGrid}
      >
        {items}
      </Grid>
    </Card>
  );
}

const Slider = (props) => {
  let productArray = [];
  const products = [];
  props.products.forEach((product, index) => {
    if (index % 3 === 0 && productArray.length > 0) {
      products.push(productArray);
      productArray = [];
    } else if (props.products.length === index + 1) {
      productArray.push(product);
      products.push(productArray);
      return false;
    }
    productArray.push(product);
  });

  return (
    <Carousel
      autoPlay={false}
      navButtonsAlwaysVisible={false}
    >
      {products.map((item, index) => {
        return (
          <Banner
            item={item}
            onClick={props.onClick}
            key={index}
            contentPosition={item.contentPosition}
          />
        );
      })}
    </Carousel>
  );
};
export default Slider;

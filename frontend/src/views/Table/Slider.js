import React from 'react';
import Carousel from "react-material-ui-carousel"

import {
    Card,
    CardMedia,
    Typography,
    Grid,
    Button,
} from '@material-ui/core';

function Banner(props) {
    const totalItems = props.item.length ? props.item.length : 0;

    let items = [];



    for (let i = 0; i < totalItems; i++) {
        const item = props.item[i];

        const media = (
            <Grid  item key={item.name}>
                <CardMedia
                    className="Media"
                    image={item.image}
                    title={item.name}
                >
                    <Typography className="MediaCaption">
                        {item.name}
                    </Typography>
                </CardMedia>
                <Button variant="outlined" onClick={()=> props.onClick(item)} className="ViewButton">
Add to order                </Button>
            </Grid>
        )

        items.push(media);
    }


    return (
        <Card  style={{margin:'1rem'}} raised className="Banner">
            <Grid style={{margin:'1rem'}} container spacing={6} className="BannerGrid">
                {items}
            </Grid>
        </Card>
    )
}

const Slider = (props) => {

    let productArray = [];
    const products = []
    props.products.map((product,index) =>{
        if(index%3 === 0 && productArray.length>0){
            products.push(productArray)
            productArray = []
        }else if(props.products.length === index+1){
            productArray.push(product)
            products.push(productArray)
            return false
        }
        productArray.push(product)
        
    })

      return (
              <Carousel
                  className="Example"
                  autoPlay={true}
                  navButtonsAlwaysVisible={false}
              >
                  {
                      products.map((item, index) => {
                          return <Banner item={item} onClick={props.onClick} key={index} contentPosition={item.contentPosition} />
                      })
                  }
              </Carousel>

      )
  }
 export default Slider;
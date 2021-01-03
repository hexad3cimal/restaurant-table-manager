import React, { useEffect, useState } from "react";

import { Button, Card } from "@material-ui/core";
import SliderCard from "./SliderCard";

const Slider = ({ items }) => {
  const [itemsArray, setItems] = useState([]);
  const [next, setNext] = useState(0);
  useEffect(() => {
    if (next) {
      setItems(items.slice(4, 9));
    } else {
      setItems(items.slice(0, 4));
    }
  }, [next]);

  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
      }}
    >
      {next ? (
        <Button
          onClick={() => {
            setNext(!next);
          }}
        >
          Previous
        </Button>
      ) : null}

      {itemsArray.map((item) => {
        return <SliderCard key={item.id} item={item} />;
      })}
      <Button
        onClick={() => {
          setNext(!next);
        }}
      >
        Next
      </Button>
    </Card>
  );
};
export default Slider;

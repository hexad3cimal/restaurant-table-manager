import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Chip,
} from "@material-ui/core";

import * as Yup from "yup";
import { Formik } from "formik";
import { getBranches, addProduct, 
  getSimilarTags
 } from "../../actions";

const AddProduct = () => {
  const dispatch = useDispatch();
  const branchState = useSelector((state) => state.branch);
  const kitchenState = useSelector((state) => state.kitchen);
  const tagState = useSelector((state) => state.tag);
  const [image, setImage] = useState(null);
  const [tag, setTag] = useState([]);
  const [similarTags, setSimilarTags] = useState([]);

  const branches = (branchState && branchState.branches) || [];
  const kitchens = (kitchenState && kitchenState.kitchens) || [];
  const similarTagsFromState = (tagState && tagState.similar) || [];
  const fileEl = React.useRef(null);
  const onButtonClick = () => {
    fileEl.current.click();
  };

  const fileChange = (e) => {
    setImage(e.target.files[0]);
  };
  useEffect(() => {
    setSimilarTags(similarTagsFromState.map( tag => {return tag.name}))
  }, [similarTagsFromState]);
  useEffect(() => {
    dispatch(getBranches());
  }, []);
  const getTagSuggestions = (branchId, tagName) => {
    dispatch(getSimilarTags({ branchId, tagName }));
  };
  return (
    <Formik
      initialValues={{
        productName: "",
        branchId: "",
        kitchenId: "",
        price: "",
        description: "",
        discount: 0,
        file: null,
        highlight: false,
        quantity: 0,
        tags: "",
      }}
      validationSchema={Yup.object().shape({
        productName: Yup.string()
          .max(255)
          .required("Product name  is required"),

        branchId: Yup.string().test(
          "branchIdtest",
          "Please select a branch",
          function (value) {
            if (branches && branches.length === 1) {
              return true;
            } else {
              if (value && value.length > 10) return true;
            }
            return false;
          }
        ),
        kitchenId: Yup.string().test(
          "kitchenIdtest",
          "Please select a kitchen",
          function (value) {
            if (kitchens && kitchens.length === 1) {
              return true;
            } else {
              if (value && value.length > 10) return true;
            }
            return false;
          }
        ),
        price: Yup.number().required("Price is required"),
      })}
      onSubmit={(values) => {
        values.branchName = branches.reduce(function (branchNameArray, branch) {
          if (branch.id === values.branchId) {
            branchNameArray.push(branch.name);
          }
          return branchNameArray;
        }, [])[0];
  
        values.kitchenName = kitchens.reduce(function (
          kitchenNameArray,
          kitchen
        ) {
          if (kitchen.id === values.kitchenId) {
            kitchenNameArray.push(kitchen.name);
          }
          return kitchenNameArray;
        },
        [])[0];

        values.file = image;
        values.tags = tag;
        const form = new FormData();
        for (let value in values) {
          form.append(value, values[value]);
        }
        dispatch(addProduct(form));
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        touched,
        values,
      }) => (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader subheader="Add new product" title="Add product" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.productName && errors.productName)}
                    fullWidth
                    helperText={touched.productName && errors.productName}
                    label="Product Name"
                    margin="normal"
                    name="productName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.productName}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    error={Boolean(touched.price && errors.price)}
                    fullWidth
                    helperText={touched.price && errors.price}
                    label="Price"
                    margin="normal"
                    name="price"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.price}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    error={Boolean(touched.discount && errors.discount)}
                    fullWidth
                    helperText={touched.discount && errors.discount}
                    label="Discount"
                    margin="normal"
                    name="discount"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.discount}
                    variant="outlined"
                    type="number"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Select Branch"
                    name="branchId"
                    error={Boolean(touched.branchId && errors.branchId)}
                    helperText={touched.branchId && errors.branchId}
                    onChange={handleChange}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={values.branchId}
                    variant="outlined"
                  >
                    <option key="" value=""></option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Select Kitchen"
                    name="kitchenId"
                    error={Boolean(touched.kitchenId && errors.kitchenId)}
                    helperText={touched.kitchenId && errors.kitchenId}
                    onChange={handleChange}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={values.kitchenId}
                    variant="outlined"
                  >
                    <option key="" value=""></option>
                    {kitchens.map((kitchen) => (
                      <option key={kitchen.id} value={kitchen.id}>
                        {kitchen.name}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item md={2} xs={3}>
                  <TextField
                    error={Boolean(touched.quantity && errors.quantity)}
                    fullWidth
                    helperText={touched.quantity && errors.quantity}
                    label="Quantity"
                    margin="normal"
                    name="quantity"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.quantity}
                    variant="outlined"
                    type="number"
                  />
                </Grid>
                <Grid item md={2} xs={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.highlight}
                        name="highlight"
                        onChange={handleChange}
                      />
                    }
                    label="Highlight"
                  />
                </Grid>

                <Grid item md={2} xs={3}>
                  <input
                    accept="image/*"
                    type="file"
                    ref={fileEl}
                    onChange={fileChange}
                    style={{ display: "none" }}
                  />
                  <Button
                    variant={image ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => onButtonClick()}
                  >
                    {image ? image.name : "Upload Pic"}
                  </Button>
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.description && errors.description)}
                    fullWidth
                    helperText={touched.description && errors.description}
                    label="Product Description"
                    margin="normal"
                    name="description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Grid item md={6} xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  value={tag}
                  onChange={(event, newValue) => {
                    setTag(newValue)
                  }}
                  options={similarTags}
                  getOptionLabel={(option) => option}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => {
                      return (
                        <Chip label={option} {...getTagProps({ index })} />
                      );
                    })
                  }
                  onInputChange={(event, newInput) => {
                    getTagSuggestions(values.branchId,newInput)
                  }}
                  style={{ width: 500 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tags"
                      variant="outlined"
                      placeholder="Tags"
                    />
                  )}
                />
              </Grid>
            </CardContent>
            <Divider />
            <Box display="flex" justifyContent="flex-end" p={2}>
              <Button
                color="primary"
                type="submit"
                variant="contained"
              >
                Add
              </Button>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
};

AddProduct.propTypes = {
  className: PropTypes.string,
};

export default AddProduct;

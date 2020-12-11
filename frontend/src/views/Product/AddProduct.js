import React, { useEffect, useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getBranches, addProduct } from "../../actions";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles,
  ButtonBase,
} from "@material-ui/core";

import * as Yup from "yup";
import { Formik } from "formik";

const useStyles = makeStyles(() => ({
  root: {},
}));

const AddItem = ({ className, ...rest }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const branchState = useSelector((state) => state.branch);
  const kitchenState = useSelector((state) => state.kitchen);
  const [image, setImage] = useState(null);
  const branches = (branchState && branchState.branches) || [];
  const kitchens = (kitchenState && kitchenState.kitchens) || [];
  const inputEl = React.useRef(null);
  const onButtonClick = () => {
    inputEl.current.click();
  };

  const fileChange = (e) => {
    setImage(e.target.files[0]);
  };
  useEffect(() => {
    dispatch(getBranches());
  }, []);
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
        quantity: 0,
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
        if (branches && branches.length === 1) {
          values.branchId = branches && branches[0].id;
        }
        values.branchName = branches.reduce(function (branchNameArray, branch) {
          if (branch.id === values.branchId) {
            branchNameArray.push(branch.name);
          }
          return branchNameArray;
        }, [])[0];
        if (kitchens && kitchens.length === 1) {
          values.kitchenId = kitchens && kitchens[0].id;
        }
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

        values.file= image;
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
        isSubmitting,
        touched,
        values,
      }) => (
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          noValidate
          className={clsx(classes.root, className)}
          {...rest}
        >
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
                    disabled={branches && branches.length === 1}
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
                    disabled={kitchens && kitchens.length === 1}
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
                <Grid item md={4} xs={12}>
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
                <Grid item md={4} xs={12}>
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
                <Grid item md={4} xs={12}>
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
                <Grid item md={6} xs={12}>
                  <input
                    accept="image/*"
                    className={classes.input}
                    id="outlined-button-file"
                    multiple
                    type="file"
                    ref={inputEl}
                    onChange={fileChange}
                  />
                  <label htmlFor="outlined-button-file">
                    <ButtonBase onClick={() => onButtonClick()} />
                  </label>
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
            </CardContent>
            <Divider />
            <Box display="flex" justifyContent="flex-end" p={2}>
              <Button color="primary" type="submit" variant="contained">
                Save details
              </Button>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
};

AddItem.propTypes = {
  className: PropTypes.string,
};

export default AddItem;

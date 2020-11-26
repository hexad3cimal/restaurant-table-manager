import React, { useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getBranches, addProduct } from '../../actions';

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
} from '@material-ui/core';

import * as Yup from 'yup';
import { Formik } from 'formik';

const useStyles = makeStyles(() => ({
  root: {},
}));

const AddItem = ({ className, ...rest }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const appState = useSelector(state => state.app);
  const branchState = useSelector(state => state.branch);

  const branches = (branchState && branchState.branches) || [];

  useEffect(() => {
    dispatch(getBranches());
  }, []);
  return (
    <Formik
      initialValues={{
        productName: '',
        branchId: ((branches && branches.length ===1) ? branches[0].id : null),
        price: '',
        description: '',
        discount:'',
        image:''
      }}
      validationSchema={Yup.object().shape({
        productName: Yup.string()
          .max(255)
          .required('Product name  is required'),

        branchId: Yup.string()
          .max(255)
          .required('Branch is required'),
        price: Yup.number()
          .required('Price is required'),
      })}
      onSubmit={values => {
        values.branchName = branches.reduce(function(branchNameArray, branch) {
          if (branch.id === values.branchId) {
            branchNameArray.push(branch.name);
          }
          return branchNameArray;
        }, [])[0];
        dispatch(addProduct(values));
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
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
                    disabled={(branches && branches.length ===1)}
                    variant="outlined"
                  >
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item md={6} xs={12}>
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
                <Grid item md={6} xs={12}>
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
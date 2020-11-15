import React, { useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

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
  TextareaAutosize,
} from '@material-ui/core';
import { add } from '../../actions';
import * as Yup from 'yup';
import { Formik } from 'formik';
const useStyles = makeStyles(() => ({
  root: {},
}));

const AddBranch = ({ className, ...rest }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{
        name: '',
        address: '',
        contact: '',
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .max(255)
          .required('Branch name is required'),
      })}
      onSubmit={values => {
        dispatch(add(values));
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className={clsx(classes.root, className)}
          {...rest}
        >
          <Card>
            <CardHeader subheader="Add new branch of your organisation" title="Add new branch" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    label="Branch Name"
                    margin="normal"
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.address && errors.address)}
                    fullWidth
                    helperText={touched.address && errors.address}
                    label="Branch Address"
                    margin="normal"
                    name="address"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.address}
                    variant="outlined"
                    multiline={true}
                    rows={5}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.contact && errors.contact)}
                    fullWidth
                    helperText={touched.contact && errors.contact}
                    label="Contact No"
                    margin="normal"
                    name="contact"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.contact}
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

AddBranch.propTypes = {
  className: PropTypes.string,
};

export default AddBranch;

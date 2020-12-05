import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getBranches, addTable, addKitchen } from '../../actions';

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
import { request } from '../../modules/client';

const useStyles = makeStyles(() => ({
  root: {},
}));

const AddTable = ({ className, ...rest }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const appState = useSelector(state => state.app);
  const branchState = useSelector(state => state.branch);

  const branches = (branchState && branchState.branches) || [];

  const [branchName, setBranchName] = useState("");

  useEffect(() => {
    if(branches.length ===1)setBranchName(branches[0].name)
  }, [branches]);

  useEffect(() => {
    dispatch(getBranches());
  }, []);
  return (
    <Formik
      initialValues={{
        name: branchName && `${branchName}-`+'',
        userName: branchName && `${branchName}-`+'',
        branchId: branchName && branches[0].id,
        branchName: branchName && branchName || '',
        password: ''
      }}
      validationSchema={Yup.object().shape({
        userName: Yup.string()
        .test('checkUsername', 'username already taken', function(username) {
          return new Promise((resolve, reject) => {
            request(`${window.restAppConfig.api}/user/validate?username=${username}`)
              .then(response => {
                if (response.data === true) resolve(true);
                else {
                  resolve(false);
                }
              })
              .catch(error => {
                resolve(false);
              });
          });
        })
        .required('username is required'),
        name: Yup.string()
          .max(255)
          .required('Tablename  is required'),
        password: Yup.string()
          .max(255)
          .required('Password is required'),
        branchId: Yup.string()
          .max(255)
          .required('Branch is required'),
      })}
      onSubmit={values => {
        values.branchName = branches.reduce(function(branchNameArray, branch) {
          if (branch.id === values.branchId) {
            branchNameArray.push(branch.name);
          }
          return branchNameArray;
        }, [])[0];
        dispatch(addKitchen(values));
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
            <CardHeader subheader="Add new table" title="Add table" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    label="Kitchen Name"
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
                    error={Boolean(touched.userName && errors.userName)}
                    fullWidth
                    helperText={touched.userName && errors.userName}
                    label="Username"
                    margin="normal"
                    name="userName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.userName}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.password && errors.password)}
                    fullWidth
                    helperText={touched.password && errors.password}
                    label="Password"
                    margin="normal"
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    variant="outlined"
                    type="password"
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
                      <option key="" value="">
                        Select a branch
                      </option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </TextField>
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

AddTable.propTypes = {
  className: PropTypes.string,
};

export default AddTable;

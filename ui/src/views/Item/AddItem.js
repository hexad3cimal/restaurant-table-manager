import React, { useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getBranchesOFOrg, addTable } from '../../actions';

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
    dispatch(getBranchesOFOrg());
  }, []);
  return (
    <Formik
      initialValues={{
        tableName: '',
        branchId: '',
        branchName: '',
      }}
      validationSchema={Yup.object().shape({
        tableName: Yup.string()
          .max(255)
          .required('Tablename  is required'),

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
        dispatch(addTable(values));
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
                    error={Boolean(touched.tableName && errors.tableName)}
                    fullWidth
                    helperText={touched.tableName && errors.tableName}
                    label="Table Name"
                    margin="normal"
                    name="tableName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.tableName}
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
                    variant="outlined"
                  >
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

AddItem.propTypes = {
  className: PropTypes.string,
};

export default AddItem;

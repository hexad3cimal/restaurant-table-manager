import React, { useEffect, useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getBranches, addTable } from "../../actions";

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
} from "@material-ui/core";

import * as Yup from "yup";
import { Formik } from "formik";
import { request } from "../../modules/client";

const useStyles = makeStyles(() => ({
  root: {},
}));

const AddTable = ({ className, edit }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const branchState = useSelector((state) => state.branch);
  const tableState = useSelector((state) => state.table);

  const selectedTable = (tableState && tableState.selectedTable) || {};
  const branches = (branchState && branchState.branches) || [];

  const [table, setTable] = useState({
    name: "",
    userName: "",
    branchId: "",
    branchName: "",
    password: "",
  });

  useEffect(() => {
    if (branches.length === 1)
      setTable({ ...table, branchName: branches[0].name });
  }, [branches]);

  useEffect(() => {
    if (edit) setTable({ ...selectedTable });
  }, [selectedTable, edit]);

  useEffect(() => {
    dispatch(getBranches());
  }, []);
  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: table.name,
        userName: table.userName,
        branchId: table.branchId,
        branchName: table.branchName,
        password: table.password,
        edit: false,
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().max(255).required("Tablename  is required"),
        userName: Yup.string()
          .test("checkUsername", "Username already taken", function (username) {
            return new Promise((resolve, reject) => {
              request(
                `${window.restAppConfig.api}/user/auth/validate?username=${username}`
              )
                .then((response) => {
                  if (response.data === true) resolve(true);
                  else {
                    resolve(false);
                  }
                })
                .catch((error) => {
                  resolve(false);
                });
            });
          })
          .required("username is required"),
        password: Yup.string().test(
          "checkPass",
          "password is required",
          function (password) {
            if (edit || (password && password.length > 3)) return true;
            return false;
          }
        ),
        branchId: Yup.string().max(255).required("Branch is required"),
      })}
      onSubmit={(values) => {
        values.branchName = branches.reduce(function (branchNameArray, branch) {
          if (branch.id === values.branchId) {
            branchNameArray.push(branch.name);
          }
          return branchNameArray;
        }, [])[0];
        if (edit) {
          values.edit = true;
          values.id = table.id;
          dispatch(addTable(values));
          return;
        }
        dispatch(addTable(values));
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
                    label="Table Name"
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
                    <option value=""></option>
                    {branches.map((branch) => (
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

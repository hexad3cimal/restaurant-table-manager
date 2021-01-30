import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getBranches, addTable, initiateTableAdd, selectedTable as setSelectedTable } from "../../actions";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from "@material-ui/core";

import { Formik } from "formik";
import { remoteValidate } from "../../modules/helpers";


const AddTable = () => {
  const dispatch = useDispatch();
  const branchState = useSelector((state) => state.branch);
  const tableState = useSelector((state) => state.table);
  const user = useSelector(state => state.user) || {}

  const selectedTable = (tableState && tableState.selectedTable) || {};
  const branches = (branchState && branchState.branches) || [];
  const formErrors = useRef({});
  const formValues = useRef({newPassword:''});
  const passwordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{5,})"
  );

  
  const [table, setTable] = useState({
    id:'',
    name: "",
    userName: "",
    branchId: "",
    branchName: "",
    password: "",
    passwordConfirm:''
  });

  useEffect(()=>{
    if(!branchState.selectedBranch){
      setTable({...table ,userName:user.user.name.split(" ").join("")+"-table-"})
    }
  },[user])

  useEffect(() => {
    selectedTable && setTable({ ...selectedTable });
  }, [selectedTable]);

  useEffect(() => {
    dispatch(getBranches());
  }, []);
  const errorRules = {
    newUserName: {
      required: true,
      remoteValidate: true,
      url:`${window.restAppConfig.api}user/validate?username`,
      errorMessages: {
        required: "Username is Required",
        remoteValidate: "Username already Taken",
      },
    },
    newPassword: {
      required: table.id ? (formValues.current.newPassword.length ? true: false): true,
      regex: passwordRegex,
      errorMessages: {
        required: "Password is Required",
        regex:
          "Password should contain at least 1 numeric,special character and be of atleast 5 characters",
      },
    },
    passwordConfirm: {
      required: table.id ? (formValues.current.newPassword.length ? true: false): true,
      compareWith: "newPassword",
      errorMessages: {
        required: "Please confirm the password",
        compareWith: "Password doesn't match",
      },
    },
    name: {
      required: true,
      errorMessages: { required: "Full name is Required" },
    },
    branchId: {
      required: true,
      errorMessages: { required: "Please select a branch" },
    },
  };


  const back = ()=>{
    dispatch(initiateTableAdd(false))
    dispatch(setSelectedTable({}))
  }
  
  const validate = async (values) => {
    const errors = {};
    for (let value in values) {
      if(errorRules[value] && errorRules[value].required){
        if (!values[value]) {
          errors[value] = errorRules[value]["errorMessages"]["required"];
        }
        if (errorRules[value].remoteValidate) {
          if (
            formValues.current[value] !== values[value] ||
            formErrors.current[value]
          ) {
            let url = `${errorRules[value].url}=${values[value]}`
            if(table.id){
              url = `${url}&id=${table.id}`
            }
            const result = await remoteValidate(
              url
            );
            if (!result)
              errors[value] =
                errorRules[value]["errorMessages"]["remoteValidate"];
          }
        }
        if (errorRules[value].regex) {
          if (!errorRules[value].regex.test(values[value]))
            errors[value] = errorRules[value]["errorMessages"]["regex"];
        }
        if (errorRules[value].compareWith) {
          if (values[value] !== values[errorRules[value]["compareWith"]])
            errors[value] = errorRules[value]["errorMessages"]["compareWith"];
        }
      }
   
    }

    formErrors.current = errors;
    formValues.current = {...formValues.current,values};
    return errors;
  };


  return (
    <Card>
    <CardContent >
    <Formik
      enableReinitialize
      initialValues={{
        name: table.name,
        newUserName: table.userName,
        branchId: table.branchId,
        branchName: table.branchName,
        newPassword: table.password,
        passwordConfirm:'',
        edit: false,
      }}
     validate={validate}
      onSubmit={(values, formik) => {
        values.branchName = branches.reduce(function (branchNameArray, branch) {
          if (branch.branchId === values.branchId) {
            branchNameArray.push(branch.name);
          }
          return branchNameArray;
        }, [])[0];
        if (table.id) {
          values.edit = true;
          values.id = table.id;
          dispatch(addTable(values));
          return;
        }
        dispatch(addTable(values));
        formik.setSubmitting(false);
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
        >
          <Card>
            <CardHeader  title={table.id ? "Edit table" : "Add table"} />
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
                    error={Boolean(touched.newUserName && errors.newUserName)}
                    fullWidth
                    helperText={touched.newUserName && errors.newUserName}
                    label="Username"
                    margin="normal"
                    name="newUserName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.newUserName}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <TextField
                    error={Boolean(touched.newPassword && errors.newPassword)}
                    fullWidth
                    helperText={touched.newPassword && errors.newPassword}
                    label="Password"
                    margin="normal"
                    name="newPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.newPassword}
                    variant="outlined"
                    type="password"
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <TextField
                    error={Boolean(touched.passwordConfirm && errors.passwordConfirm)}
                    fullWidth
                    helperText={touched.passwordConfirm && errors.passwordConfirm}
                    label="Password"
                    margin="normal"
                    name="passwordConfirm"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.passwordConfirm}
                    variant="outlined"
                    type="password"
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <TextField
                    fullWidth
                    label="Select Branch"
                    name="branchId"
                    margin="normal"
                    error={Boolean(touched.branchId && errors.branchId)}
                    helperText={touched.branchId && errors.branchId}
                    onChange={handleChange}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={values.branchId}
                    variant="outlined"
                    InputLabelProps={{ shrink: values.branchId }}  
                  >
                    <option value=""></option>
                    {branches.map((branch) => (
                      <option key={branch.branchId} value={branch.branchId}>
                        {branch.name}
                      </option>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <Box display="flex" justifyContent="space-between" p={2}>
            <Button color="secondary"  onClick={()=> {back()}} type="button" variant="contained">
                Go back
              </Button>
              <Button color="primary" type="submit" disabled={isSubmitting } variant="contained">
                {table.id ? 'Update Table': 'Add'}
              </Button>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
    </CardContent>
    </Card>
  );
};

AddTable.propTypes = {
  table: PropTypes.object,
};

export default AddTable;

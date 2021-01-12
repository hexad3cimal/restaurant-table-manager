import React, { useEffect, useRef, useState }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from '@material-ui/core';
import { addBranch, hideAlert, initiateBranchAdd, setBranch as setBranchInState } from '../../actions';
import { Formik } from 'formik';
import { remoteValidate } from '../../modules/helpers';
import Toast from '../../modules/toast';

const AddBranch = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user) || {}
  const appState = useSelector((state) => state.app) || {};
  const branchState = useSelector((state) => state.branch) || {};

  const formErrors = useRef({});
  const formValues = useRef({newPassword:''});

  const [branch,setBranch] = useState({
    id:'',
    name: '',
    address: '',
    newUserName: '',
    newPassword: '',
    passwordConfirm: '',
    email: '',
    contact: '',
    edit: false
  })

  const passwordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{5,})"
  );

  useEffect(()=>{
    const selectedBranch = branchState.selectedBranch;
    if(selectedBranch){
      setBranch({...selectedBranch ,newUserName:selectedBranch.userName})

    }
  },[branchState.selectedBranch])

  useEffect(()=>{
    if(!branchState.selectedBranch){
      setBranch({...branch ,newUserName:user.user.name.split(" ").join("")+"-"})
    }
  },[user])

  if (appState.alert.show) {
    Toast({ message: appState.alert.message });
    dispatch(hideAlert());

  }
  const errorRules = {
    newUserName: {
      required: true,
      remoteValidate: true,
      url: `${window.restAppConfig.api}user/validate?username`,
      errorMessages: {
        required: "Username is Required",
        remoteValidate: "Username already Taken",
      },
    },
    newPassword: {
      required: branch.id ? false: true,
      regex: passwordRegex,
      errorMessages: {
        required: "Password is Required",
        regex:
          "Password should contain at least 1 numeric,special character and be of atleast 5 characters",
      },
    },
    passwordConfirm: {
      required: formValues.current.newPassword.length>0 ? false: true,
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
  };

  const back = ()=>{
    dispatch(initiateBranchAdd(false))
    dispatch(setBranchInState({}))
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
              if(branch.id){
                url = `${url}&id=${branch.id}`
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
    <Formik
    enableReinitialize
      initialValues={branch}
      validate={validate}
      onSubmit={(values,formik) => {
        if(branch.id)values.edit=true
        dispatch(addBranch(values));
        formik.setSubmitting(false);
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <Card>
            <CardHeader title={branch.id? "Edit branch" : "Add new branch"}/>
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
                    error={Boolean(touched.email && errors.email)}
                    fullWidth
                    helperText={touched.email && errors.email}
                    label="Email"
                    margin="normal"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    variant="outlined"
                    type="email"
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
                <Grid item md={6} xs={12}>
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
                    autoComplete="off"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.passwordConfirm && errors.passwordConfirm)}
                    fullWidth
                    helperText={touched.passwordConfirm && errors.passwordConfirm}
                    label="Confirm Password"
                    margin="normal"
                    name="passwordConfirm"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.passwordConfirm}
                    variant="outlined"
                    type="password"
                  />
                </Grid>

                <Grid item md={12} xs={12}>
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
              </Grid>
            </CardContent>
            <Divider />
            <Box display="flex" justifyContent="space-between" p={2}>
            <Button color="secondary"  onClick={()=> {back()}} type="button" variant="contained">
                Go back
              </Button>
              <Button color="primary" type="submit"  disabled={isSubmitting} variant="contained">
                {branch.id ? 'Update Branch' : 'Add Branch'}
              </Button>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
};


export default AddBranch;

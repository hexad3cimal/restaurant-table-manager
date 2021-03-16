import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, hideAlert } from "../../actions";
import 
  Box
 from "@material-ui/core/Box";
import 
  Button
from "@material-ui/core/Button";
import 
  Card
from "@material-ui/core/Card";
import 
  CardContent
 from "@material-ui/core/CardContent";
import 
  CardHeader
from "@material-ui/core/CardHeader";
import 
  Divider from "@material-ui/core/Divider";
import 
  Grid
from "@material-ui/core/Grid";
import 
  TextField
 from "@material-ui/core/TextField";
import { Formik } from "formik";
import { useRef } from "react";
import Toast from '../../modules/toast';


const Settings = () => {
  const dispatch = useDispatch();
  const formErrors = useRef({});
  const formValues = useRef({newPassword:''});
  const appState = useSelector((state) => state.app) || {};

  const passwordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{5,})"
  );


  if (appState.alert.show) {
    Toast({ message: appState.alert.message });
    dispatch(hideAlert());
  }
  

  const errorRules = {

    newPassword: {
      required: true,
      regex: passwordRegex,
      errorMessages: {
        required: "Password is Required",
        regex:
          "Password should contain at least 1 numeric,special character and be of atleast 5 characters",
      },
    },
    passwordConfirm: {
      required: true,
      compareWith: "newPassword",
      errorMessages: {
        required: "Please confirm the password",
        compareWith: "Password doesn't match",
      },
    },
  };


  const validate = async (values) => {
    const errors = {};
    for (let value in errorRules) {
      if(errorRules[value] && errorRules[value].required){
        if (!values[value]) {
          errors[value] = errorRules[value]["errorMessages"]["required"];
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
    formValues.current = {...formValues.current,...values};
    return errors;
  };
  return (
    <Card>
      <CardContent >
        <Formik
          enableReinitialize
          initialValues={{
            newPassword: '',
            passwordConfirm: '',
          }}
          validate={validate}
          onSubmit={(values, formik) => {
            dispatch(updateUser(values));
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
                <CardHeader title={"Change password"} />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
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
                  </Grid>
                </CardContent>
                <Divider />
                <Box display="flex" justifyContent="space-between" p={2}>
                  <Button color="primary" type="submit" disabled={isSubmitting} variant="contained">
                    Change password
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


export default Settings;

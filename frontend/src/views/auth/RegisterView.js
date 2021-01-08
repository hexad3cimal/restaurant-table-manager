import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import Page from "../../components/Page";
import { useDispatch, useSelector } from "react-redux";
import { register, hideAlert } from "../../actions";
import Toast from "../../modules/toast";
import { isFormValid } from "../../modules/helpers";
import { request } from "../../modules/client";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const RegisterView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const appState = useSelector((state) => state.app);
  const user = useSelector((state) => state.user);
  const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{5,})");
  if (appState.alert.show) {
    Toast({ message: appState.alert.message });
    dispatch(hideAlert());

    if (user.registered) navigate("/login");
  }
  return (
    <Page className={classes.root} title="Register">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              newEmail: "",
              name: "",
              newUserName: "",
              newPassword: "",
              passwordConfirm: "",
            }}
            validationSchema={Yup.object().shape({
              newEmail: Yup.string()
                .email("Must be a valid email")
                .test("checkEmail", "Email already taken", function (email) {
                  return new Promise((resolve, reject) => {
                    request(
                      `${window.restAppConfig.api}/user/validate?email=${email}`
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
                .required("Email is required"),
              newUserName: Yup.string()
                .test(
                  "checkUsername",
                  "Username already taken",
                  function (username) {
                    return new Promise((resolve, reject) => {
                      request(
                        `${window.restAppConfig.api}/user/validate?username=${username}`
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
                  }
                )
                .required("username is required"),
              newPassword: Yup.string().test(
                "passwordComplexity",
                "Password should contain at least 1 numeric,special character and be of atleast 5 characters",
                function (newPassword) {
                  return new Promise((resolve, reject) => {
                    if (passwordRegex.test(newPassword)) resolve(true);
                    resolve(false);
                  });
                }
              )
                .max(20)
                .required("password is required"),
              passwordConfirm: Yup.string()
                .test(
                  "confirmPasswordCheck",
                  "Password doesn't match",
                  function (passwordConfirm) {
                    return new Promise((resolve, reject) => {
                      if (this.parent.newPassword === passwordConfirm) resolve(true);
                      resolve(false);
                    });
                  }
                )
                .required("Please confirm password"),
            })}
            onSubmit={(values) => {
              values.org = true;
              dispatch(register(values));
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
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography color="textPrimary" variant="h2">
                    Create new account
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Use your email to create new account
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.name && errors.name)}
                  fullWidth
                  helperText={touched.name && errors.name}
                  label="Fullname"
                  margin="normal"
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.newEmail && errors.newEmail)}
                  fullWidth
                  helperText={touched.newEmail && errors.newEmail}
                  label="Email Address"
                  margin="normal"
                  name="newEmail"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.newEmail}
                  variant="outlined"
                />
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
                <TextField
                  error={Boolean(touched.newPassword && errors.newPassword)}
                  fullWidth
                  helperText={touched.newPassword && errors.newPassword}
                  label="Password"
                  margin="normal"
                  name="newPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.newPassword}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(
                    touched.passwordConfirm && errors.passwordConfirm
                  )}
                  fullWidth
                  helperText={touched.passwordConfirm && errors.passwordConfirm}
                  label="Confirm Password"
                  margin="normal"
                  name="passwordConfirm"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.passwordConfirm}
                  variant="outlined"
                />
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={!isFormValid(errors, touched)}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign up now
                  </Button>
                </Box>
                <Typography color="textSecondary" variant="body1">
                  Have an account?
                  <Link component={RouterLink} to="/login" variant="h6">
                    Sign in
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default RegisterView;

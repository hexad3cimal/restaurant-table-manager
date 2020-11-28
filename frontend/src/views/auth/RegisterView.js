import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormHelperText,
  Link,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
import Page from '../../components/Page';
import { useDispatch, useSelector } from 'react-redux';
import { register, hideAlert } from '../../actions';
import Toast from '../../modules/toast';
import { isFormValid } from '../../modules/helpers';
import { request } from '../../modules/client';
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const RegisterView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const appState = useSelector(state => state.app);
  const user = useSelector(state => state.user);

  if (appState.alert.show) {
    Toast({ message: appState.alert.message });
    dispatch(hideAlert());

    if (user.registered) navigate('/login', { replace: true });
  }
  return (
    <Page className={classes.root} title="Register">
      <Box display="flex" flexDirection="column" height="100%" justifyContent="center">
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: '',
              name: '',
              userName: '',
              lastName: '',
              password: '',
              policy: false,
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email('Must be a valid email')
                .test('checkEmail', 'Email already taken', function(email) {
                  return new Promise((resolve, reject) => {
                    request(`${window.restAppConfig.api}/user/validate?email=${email}`)
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
                .required('Email is required'),
              userName: Yup.string()
                .test('checkUsername', 'Username already taken', function(username) {
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
              password: Yup.string()
                .max(255)
                .required('password is required'),
              policy: Yup.boolean().oneOf([true], 'This field must be checked'),
            })}
            onSubmit={values => {
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
                  <Typography color="textSecondary" gutterBottom variant="body2">
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
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email Address"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
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
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box alignItems="center" display="flex" ml={-1}>
                  <Checkbox checked={values.policy} name="policy" onChange={handleChange} />
                  <Typography color="textSecondary" variant="body1">
                    I have read the{' '}
                    <Link
                      color="primary"
                      component={RouterLink}
                      to="#"
                      underline="always"
                      variant="h6"
                    >
                      Terms and Conditions
                    </Link>
                  </Typography>
                </Box>
                {Boolean(touched.policy && errors.policy) && (
                  <FormHelperText error>{errors.policy}</FormHelperText>
                )}
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting || !isFormValid(errors, touched)}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign up now
                  </Button>
                </Box>
                <Typography color="textSecondary" variant="body1">
                  Have an account?{' '}
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

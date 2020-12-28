import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  makeStyles,
  Grid,
} from '@material-ui/core';
import Page from '../../components/Page';
import { useDispatch, useSelector } from 'react-redux';
import { login, hideAlert } from '../../actions';
import Toast from '../../modules/toast';
import {isFormValid} from '../../modules/helpers';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  box:{
    display: 'flex'
  },
  homeBox: {
    height: '100%',
    backgroundImage: `url('/images/bg.png')`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    margin: theme.spacing(6)
  },
  loginBox: {
    height: '100%',
    marginTop: theme.spacing(10)
  }
}));

const LoginView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const appState = useSelector(state => state.app);
  const user = useSelector(state => state.user);

  if (appState.alert.show) {
    Toast({ message: appState.alert.message });
    dispatch(hideAlert());
    if (user.isAuthenticated) {
      if(user.role === 'table'){
        navigate('/table', { replace: true });
        return;
      }
      if(user.role === 'kitchen'){
        navigate('/kitchen', { replace: true });
        return;
      }
      navigate('/app/dashboard', { replace: true });
    }
  }
  return (
    <Page className={classes.root} title="Login">
      <Box className={classes.box}>
        <Container className={classes.box} flexDirection="row">
        <Grid item md={12} xs={0} className={classes.homeBox}>
        </Grid>
        <Grid className={classes.loginBox} item md={12} xs={12}>
          <Formik
            initialValues={{
              userName: '',
              password: '',
            }}
            validationSchema={Yup.object().shape({
              userName: Yup.string()
                .max(255)
                .required('UserName is required'),
              password: Yup.string()
                .max(255)
                .required('Password is required'),
            })}
            onSubmit={(values, formik) => {
              dispatch(login(values));
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

              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography color="textPrimary" variant="h2">
                    Sign in
                  </Typography>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Sign in on the internal platform
                  </Typography>
                </Box>
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
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting || !isFormValid(errors, touched)}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign in now
                  </Button>
                </Box>
                <Typography color="textSecondary" variant="body1">
                  Don&apos;t have an account?{' '}
                  <Link component={RouterLink} to="/register" variant="h6">
                    Sign up
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Grid>
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;

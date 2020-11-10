import React, { useState } from 'react';
import { Box, Button, FormField, Text, TextInput } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { string, object, boolean } from 'yup';
import styled from 'styled-components';
import { login, register as registerAction, hideAlert } from '../../actions';
import Loader from '../Loader';
import Toast from '../../modules/toast';
import { request } from '../../modules/client';

const Wrapper = styled.div`
  display: flex;
  padding: 2rem;
  margin-right: 1rem;
  border: 1rem solid #000;
  flex-wrap: wrap;
  flex-direction: row;
`;
const LoginComponent = () => {
  const [values, setValues] = useState({
    email: null,
    password: null,
    orgCode: '',
    orgName: '',
    registration: false,
  });
  const [errors, setErrors] = useState({});
  const [registerType, setRegisterType] = useState(null);
  const user = useSelector(state => state.user);
  const appState = useSelector(state => state.app);
  const dispatch = useDispatch();
  const schema = object()
    .shape({
      email: string('Please enter a valid email')
        .email('Please enter a valid email')
        .required('email is required')
        .test('is-validemail', '${path} is in use', async function(value) {
          if (this.parent.registration) {
            const result = await request(`${window.geoConfig.api}users/email?email=${value}`)
              .then(json => json.status)
              .catch(() => false);
            return result;
          }
          return true;
        }),
      org: boolean(),
      orgCode: string().when(['user'], {
        is: true,
        then: string().required(),
      }),
      orgName: string().when(['org'], {
        is: true,
        then: string().required(),
      }),
      password: string('password is required').required('password is required'),
      registration: boolean(),
      user: boolean(),
    })
    .test('global-ok', 'The data is not correct', value => {
      if (value.registration) return value.orgName.length > 1 || value.orgCode.length > 1;
      return true;
    });
  const handleChange = event => {
    const { target } = event;
    const { name, value } = target;
    values.user = name === 'orgCode';
    values.org = name === 'orgName';
    event.persist();
    schema
      .validate({ ...values, [name]: value })
      .then(() => {
        setErrors({});
      })
      .catch(error => {
        setErrors({ ...errors, [error.path]: error.message });
      });
    setValues({ ...values, [name]: value });
  };

  const handleClickLogin = () => {
    dispatch(login(values));
  };

  const signUpClick = () => {
    setValues({ ...values, registration: true });
  };

  const submitRegisterForm = () => {
    dispatch(registerAction(values));
  };

  if (appState.alert.show === true) {
    Toast({ message: appState.alert.message });
    setValues({
      email: null,
      password: null,
      orgCode: '',
      orgName: '',
      registration: false,
    });
    dispatch(hideAlert());
  }

  if (values.registration === true) {
    return user.status === 'loading' ? (
      <Loader />
    ) : (
      <Box direction="row-responsive" animation="fadeIn" width="large" justify="center" wrap={true}>
        <Wrapper>
          <Box justify="center" style={{ width: '100%' }} direction="row-responsive">
            <Text
              size="small"
              style={{ lineHeight: '4rem' }}
              color="brand"
              weight="bold"
              textAlign="center"
            >
              is this account for an
            </Text>
            <Button
              onClick={() => {
                setRegisterType('org');
              }}
              margin={{ horizontal: 'small', vertical: 'small' }}
            >
              <Box
                round="xlarge"
                background="accent-1"
                pad={{ vertical: 'small', horizontal: 'medium' }}
              >
                <Text size="small" color="brand" weight="bold" textAlign="center">
                  organization
                </Text>
              </Box>
            </Button>
            <Text
              size="small"
              style={{ lineHeight: '4rem' }}
              color="brand"
              weight="bold"
              textAlign="center"
            >
              or a
            </Text>
            <Button
              onClick={() => {
                setRegisterType('user');
              }}
              margin={{ horizontal: 'small', vertical: 'small' }}
            >
              <Box
                round="xlarge"
                background="accent-1"
                pad={{ vertical: 'small', horizontal: 'medium' }}
              >
                <Text size="small" color="brand" weight="bold" textAlign="center">
                  user
                </Text>
              </Box>
            </Button>
          </Box>
          <Box justify="center" wrap={true} direction="row-responsive">
            <FormField label="email" style={{ margin: '1rem' }} error={errors.email}>
              <TextInput
                plain
                name="email"
                disabled={!registerType}
                placeholder={<Text size="medium">email@gmail.com</Text>}
                value={values.email}
                onChange={handleChange}
              />
            </FormField>

            <FormField label="password" style={{ margin: '1rem' }} error={errors.password}>
              <TextInput
                disabled={!registerType}
                plain
                type="password"
                name="password"
                placeholder={<Text size="medium">*******</Text>}
                value={values.password}
                onChange={handleChange}
              />
            </FormField>
            <Box style={{ width: registerType ? '50%' : '100%' }}>
              <FormField label="full name" style={{ margin: '1rem' }} error={errors.fullName}>
                <TextInput
                  plain
                  name="fullName"
                  placeholder={<Text size="medium">your full-name</Text>}
                  value={values.fullName}
                  onChange={handleChange}
                />
              </FormField>
            </Box>
            <Box style={{ width: '50%' }}>
              {registerType === 'org' ? (
                <FormField label="org name" style={{ margin: '1rem' }} error={errors.orgName}>
                  <TextInput
                    plain
                    name="orgName"
                    placeholder={<Text size="medium">google inc</Text>}
                    value={values.orgName}
                    onChange={handleChange}
                  />
                </FormField>
              ) : null}
              {registerType === 'user' ? (
                <FormField label="org code" style={{ margin: '1rem' }} error={errors.orgCode}>
                  <TextInput
                    plain
                    name="orgCode"
                    placeholder={<Text size="medium">ask your org admin</Text>}
                    value={values.orgCode}
                    onChange={handleChange}
                  />
                </FormField>
              ) : null}
            </Box>
            <Button
              disabled={
                Object.keys(errors).length > 0 ||
                !(
                  (registerType === 'user' && values.orgCode.length > 1) ||
                  (registerType === 'org' && values.orgName.length > 1)
                )
              }
              onClick={() => {
                submitRegisterForm();
              }}
            >
              <Box
                round="xlarge"
                background="accent-1"
                pad={{ vertical: 'small', horizontal: 'medium' }}
              >
                <Text size="small" color="brand" weight="bold" textAlign="center">
                  register
                </Text>
              </Box>
            </Button>
          </Box>
        </Wrapper>
      </Box>
    );
  }

  return user.status === 'loading' ? (
    <Loader />
  ) : (
    <Box direction="row-responsive" animation="fadeIn" width="large" justify="center" wrap={true}>
      <Wrapper>
        <Box justify="center" direction="row-responsive">
          <FormField label="email" style={{ margin: '1rem' }} error={errors.email}>
            <TextInput
              plain
              name="email"
              placeholder={<Text size="medium">email@gmail.com</Text>}
              value={values.email}
              onChange={handleChange}
            />
          </FormField>

          <FormField label="password" style={{ margin: '1rem' }} error={errors.password}>
            <TextInput
              plain
              type="password"
              name="password"
              placeholder={<Text size="medium">*******</Text>}
              value={values.password}
              onChange={handleChange}
            />
          </FormField>
          <Button
            disabled={Object.keys(errors).length > 0}
            onClick={() => {
              handleClickLogin();
            }}
          >
            <Box
              round="xlarge"
              background="accent-1"
              pad={{ vertical: 'small', horizontal: 'medium' }}
            >
              <Text size="small" color="brand" weight="bold" textAlign="center">
                login
              </Text>
            </Box>
          </Button>
        </Box>
      </Wrapper>
      <Box fill={true} margin={{ vertical: 'small', horizontal: 'medium' }}>
        <Text size="small" color="brand" weight="bold" textAlign="center">
          Don't have an account?
        </Text>
      </Box>
      <Button
        onClick={() => {
          signUpClick();
        }}
      >
        <Box
          background="blue"
          margin={{ vertical: 'small', horizontal: 'medium' }}
          pad={{ vertical: 'small', horizontal: 'medium' }}
        >
          <Text size="small" color="white" weight="bold" textAlign="center">
            Sign up
          </Text>
        </Box>
      </Button>
    </Box>
  );
};

export { LoginComponent };

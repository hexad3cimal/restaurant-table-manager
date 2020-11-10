import React from 'react';
import { shallow } from 'enzyme';
import { App } from 'App';

jest.mock('./router', () => {});

describe('App', () => {
  beforeEach(() => {});
  const wrapper = shallow(<App />);

  it('should render app with grommet', () => {
    expect(wrapper.find('Grommet').length).toBe(1);
    expect(wrapper.find('Grommet').prop('full')).toBe(true);
    expect(wrapper.find('Grommet').prop('theme')).toMatchObject({
      button: {
        extend: [{}],
      },
      global: {
        breakpoints: {
          xsmall: {
            value: 400,
          },
        },
        colors: {
          background: {
            dark: '#000000',
            light: '#ffffff',
          },
        },
        font: {
          family:
            '-apple-system,\n         BlinkMacSystemFont, \n         "Segoe UI", \n         Roboto, \n         Oxygen, \n         Ubuntu, \n         Cantarell, \n         "Fira Sans", \n         "Droid Sans",  \n         "Helvetica Neue", \n         Arial, sans-serif,  \n         "Apple Color Emoji", \n         "Segoe UI Emoji", \n         "Segoe UI Symbol"',
        },
      },
      heading: {
        extend: {},
      },
      paragraph: {
        extend: {},
        xxlarge: {
          size: '28px',
        },
      },
      textInput: {
        placeholder: {
          extend: {},
        },
      },
    });
  });
  it('should render app with Helmet', () => {
    expect(wrapper.find('Helmet').length).toBe(1);
    expect(wrapper.find('Helmet').prop('defaultTitle')).toBe('react grommet saga');
  });
  it('should render app with ToastContainer', () => {
    expect(wrapper.find('ToastContainer').length).toBe(1);
  });
});

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  BarChart as BarChartIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  Users as UsersIcon,
} from 'react-feather';
import NavItem from './NavItem';
import { useSelector } from 'react-redux';


const items = [
  {
    href: '/app/dashboard',
    icon: BarChartIcon,
    title: 'Dashboard',
    roles:['admin','manager']
  },
  {
    href: '/app/branch',
    icon: UsersIcon,
    title: 'Branch',
    roles:['admin']
  },
  {
    href: '/app/table',
    icon: ShoppingBagIcon,
    title: 'Table',
    roles:['admin','manager']
  },
  {
    href: '/app/product',
    icon: UserIcon,
    title: 'Product',
    roles:['admin','manager']
  },
  {
    href: '/app/kitchen',
    icon: UserIcon,
    title: 'Kitchen',
    roles:['admin','manager']
  }
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256,
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)',
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64,
  },
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();

  const user = useSelector( state => state.user)
  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box alignItems="center" display="flex" flexDirection="column" p={2}>
        <Typography className={classes.name} color="textPrimary" variant="h5">
          {user.user.name}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map(item => {
            if(item.roles.includes(user.user.role))
            return <NavItem href={item.href} key={item.title} title={item.title} icon={item.icon} />
          })}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer anchor="left" classes={{ paper: classes.desktopDrawer }} open variant="persistent">
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false,
};

export default NavBar;

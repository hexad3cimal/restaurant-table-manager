import { makeStyles } from '@material-ui/core';
import React from 'react';
const useStyles = makeStyles(theme => ({
    root: {
     width: '5rem'
    }
}))

const Logo = props => {

    const classes = useStyles();

return (<img alt="Logo" className={classes.root} src="/images/logo.png" {...props} />)
};

export default Logo;

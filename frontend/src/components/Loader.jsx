import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
const  Loader = () => {
return <div style={{display:'flex',flexDirection:'column',width:'100%',minHeight:'100vh', justifyContent:'center', alignItems:'center'}}><CircularProgress />  </div>
}

export default Loader;

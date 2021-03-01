import React from 'react';
import './Loader.scss'
const Loader = () => {
  return <div className="pan-loader">
    <div className="loader"></div>
    <div className="pan-container">
      <div className="pan"></div>
      <div className="handle"></div>
    </div>
    <div className="shadow"></div>
  </div>
}

export default Loader;

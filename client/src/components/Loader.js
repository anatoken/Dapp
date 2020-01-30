import React, { Component } from 'react';

import LoaderPackage from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

class Loader extends Component {
  
  render() {
    return (
      <div className="centered">
         <LoaderPackage
         type="Puff"
         color="#00BFFF"
         height={100}
         width={100}
        />
      </div>
    );
  }
}

export default Loader;
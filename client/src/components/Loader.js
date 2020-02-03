import React, { Component } from 'react';
import Proptypes from 'prop-types';

import LoaderPackage from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

class Loader extends Component {
  static propTypes = {
    position: Proptypes.string.isRequired
  }

  render() {
    const { position } = this.props;

    return (
      <div className={`centered-${position}`}>
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
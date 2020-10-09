import React, { Fragment, useEffect } from "react";
import { Router, Route, Switch } from "react-router-dom";
import Navbar from "../components/Navbar";

import history from "../utils/history";
import Home from "./home";
import Services from "./services";
import Register from "./register";


import Collector from "./collector";
import University from "./university";
import RecyclePlant from "./recycleplant";


import getWeb3 from "../utils/getWeb3";
import Web3Context from "../utils/Web3Context";

const AppRouter = () => {
  const [web3, setWeb3] = React.useState("");

  const loadWeb3 = async () => {
    try {
      const web3 = await getWeb3();
      setWeb3(web3);
    } catch (error) {
      alert(
        `Failed to load web3. Check console for details.`,
      );
      console.error(error);
    }
  }

  useEffect(() => {
    if (web3 == "") {
      loadWeb3();
    }
  });

  return (
    <Fragment>
      <Web3Context.Provider value={web3}>
        <Navbar />
        <Router history={history}>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/register" exact component={Register} />
            <Route path="/services" exact component={Services} />
            <Route path="/collector" exact component={Collector} />
            <Route path="/university" exact component={University} />
            <Route path="/recycleplant" exact component={RecyclePlant} />
          </Switch>
        </Router>
      </Web3Context.Provider>
    </Fragment>
  );
};

export default AppRouter;

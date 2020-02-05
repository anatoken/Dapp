import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import Collector from "../views/roles/Collector.js";

const CollectorRouter = () => (
  <Fragment>
    <Switch>
      <Route exact path="/collector" component={Collector} />
    </Switch>
  </Fragment>
);

export default CollectorRouter;
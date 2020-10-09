import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import RecyclePlant from "../views/roles/RecyclePlant.js";

const RecyclePlantRouter = () => (
  <Fragment>
    <Switch>
      <Route exact path="/recycleplant" component={RecyclePlant} />
    </Switch>
  </Fragment>
);

export default RecyclePlantRouter;
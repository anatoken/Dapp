import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import University from "../views/roles/University.js";

const UniversityRouter = () => (
  <Fragment>
    <Switch>
      <Route exact path="/university" component={University} />
    </Switch>
  </Fragment>
);

export default UniversityRouter;
import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import Register from "../views/register/Register.js";

const RegisterRouter = () => (
    <Fragment>
        <Switch>
            <Route exact path="/register" component={Register} />
        </Switch>
    </Fragment>
);

export default RegisterRouter;
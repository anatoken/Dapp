import React, { Fragment } from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "../utils/history";
import Home from "./home";
import Register from "./register";

const AppRouter = () => (
    <Fragment>
        <Router history={history}>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/register" exact component={Register} />
            </Switch>
        </Router>
    </Fragment>
);

export default AppRouter;

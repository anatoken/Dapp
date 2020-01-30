import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import Services from "../views/services/Services";

const ServicesRouter = () => (
    <Fragment>
        <Switch>
            <Route exact path="/services" component={Services} />
        </Switch>
    </Fragment>
);

export default ServicesRouter;
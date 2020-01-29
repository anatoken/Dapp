import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import Balance from "../views/balance/Balance";

const BalanceRouter = () => (
    <Fragment>
        <Switch>
            <Route exact path="/balance" component={Balance} />
        </Switch>
    </Fragment>
);

export default BalanceRouter;
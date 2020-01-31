import React, { Fragment, useEffect } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {useGlobal} from "reactn";
import Balance from '../../components/Balance';
import history from "../../utils/history";

const Collector = () => {
  const [global, setGlobal] = useGlobal();

  useEffect(() => {
    if(!global.role){
      history.push("/register");
    }
  }, []);

  return (
    <Fragment>
      <CssBaseline />
      <Container fixed>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center">
          <p>Role: {global.role}</p>
          <Balance />
        </Grid>
      </Container>
    </Fragment>
  );
}
export default Collector;
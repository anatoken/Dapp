import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Title from "../../components/home/Welcome";
import Button from '@material-ui/core/Button';
import history from "../../utils/history";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  button: {

  },
  marginAutoContainer: {
    width: '100%',
    height: 80,
    display: 'flex',
  },
  marginAutoItem: {
    margin: 'auto'
  },
}));

function Balance() {
  const classes = useStyles();

  return (
    <Fragment>
      <CssBaseline />
      <Container fixed>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Title title="Your balance:" />
            <div className={classes.marginAutoContainer}>
              <div className={classes.marginAutoItem}>
                <h2>hoiii</h2>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
}

export default Balance;
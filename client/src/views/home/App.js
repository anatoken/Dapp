import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Title from "../../components/home/Welcome";
import Button from '@material-ui/core/Button';
import history from "../../utils/history";
import Image from "../../images/ethereum.png";
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  button: {
    borderRadius:30
  },
  marginAutoContainer: {
    width: '100%',
    height: 80,
    display: 'flex',
  },
  marginAutoItem: {
    margin: 'auto'
  },
  image: {
    width: 200,
    margin: 25
  },
  text:{
    textAlign:'center'
  }
}));

function App() {
  const classes = useStyles();

  return (
    <Fragment>
      <CssBaseline />
      <Container fixed>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={12}>
            <img src={Image} className={classes.image} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom className={classes.text}>
              Anatoken
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Cleaning up the world with your help. 
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={() => history.push("/register")} className={classes.button}>
              Register
          </Button>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
}

export default App;

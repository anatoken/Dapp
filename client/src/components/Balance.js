import React, { Fragment, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import Web3Context from "../utils/Web3Context";
import AnatokenContract from '../contracts/AnaToken.json';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  text: {
    width: '100%'
  },
  paper: {
    marginTop: 20,
    height: 100,
    width: '100%',
    textAlign: 'center',
    backgroundColor: '#3f51b5',
    color: '#fff'
  },
  span: {
    display: 'inline-block',
    verticalAlign: 'middle',
    lineHeight: 'normal'
  },
  marginAutoContainer: {
    width: '100%',
    height: 80,
    display: 'flex',
  },
  marginAutoItem: {
    margin: 'auto',
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    }
  },
  button: {
    marginTop: 20
  }
}));

const Balance = props => {
  const classes = useStyles();
  const web3 = React.useContext(Web3Context);
  const [isLoading, setLoading] = React.useState(true);
  const [balance, setBalance] = React.useState(0);
  const [contract, setContract] = React.useState("");

  const loadContract = async (web3) => {
    try {
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedContract = AnatokenContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AnatokenContract.abi,
        deployedContract && deployedContract.address
      );

      const balance = await instance.methods.balanceOf(accounts[0]).call();

      setBalance(balance);
      setContract(instance);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load contract. Check console for details.`,
      );

      console.error(error);
    }
  }

  useEffect(() => {
    if (Object.entries(web3).length != 0 && contract == "") {
      loadContract(web3);
    }
  });

  return (
    <Fragment>
      <CssBaseline />
      <Container fixed>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center">
          <Typography variant="h4" gutterBottom className={classes.text}>
            <Paper className={classes.paper}>
              <span className={classes.span}>ANA: {balance}</span>
            </Paper>
          </Typography>
        </Grid>
      </Container>
    </Fragment>
  );
};

export default Balance;
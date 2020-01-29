import React, { Fragment, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Title from "../../components/home/Welcome";
import Button from '@material-ui/core/Button';
import history from "../../utils/history";
import AnatokenContract from '../../contracts/AnaToken.json';
import getWeb3 from "../../getWeb3";
import Web3 from "web3";


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
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    async function getBalance() {
      console.log("test2");
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedToken = AnatokenContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AnatokenContract.abi,
        deployedToken && deployedToken.address,
        );

        var balance = web3.eth.getBalance(accounts[0].address);
        console.log("test:");
        console.log(balance);
        balance = web3.toDecimal(balance);
        setBalance(balance);
    }
    getBalance();
  }, []);

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
                <h2>{balance}</h2>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
}

export default Balance;

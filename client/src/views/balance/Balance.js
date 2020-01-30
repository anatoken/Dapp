import React, { Fragment, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Title from "../../components/home/Welcome";
import Button from '@material-ui/core/Button';
import history from "../../utils/history";
import AnatokenContract from '../../contracts/AnaToken.json';
import getWeb3 from "../../utils/getWeb3";
import Web3 from "web3";

class Balance extends React.Component {
  state = { web3: null, accounts: null, contract: null, balance: null};

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedToken = AnatokenContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AnatokenContract.abi,
        deployedToken && "0x6cB5Bc17D4A4e3ED81B88afea34B1004b02Af58E"
      );
      console.log(accounts[0]);
      const balance = await instance.methods.balanceOf(accounts[0]).call();
      console.log(balance);
      this.setState({ web3, accounts, contract: instance, balance });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
   


 
    return (
      <Fragment>
        <CssBaseline />
        <Container fixed>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Title title="Your balance:" />

                  <h2>{this.state.balance}</h2>

            </Grid>
          </Grid>
        </Container>
      </Fragment>
    );
  }
}
export default Balance;
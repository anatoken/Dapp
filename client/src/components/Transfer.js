import React, { Fragment, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import Loader from '../components/Loader';
import axios from 'axios';

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
    height: 200,
    width: '100%',
    textAlign: 'center',
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

const Tranfer = props => {
  const classes = useStyles();
  const web3 = React.useContext(Web3Context);
  const [isLoading, setLoading] = React.useState(false);
  const [balance, setBalance] = React.useState(0);
  const [contract, setContract] = React.useState("");
  const [amount, setAmount] = React.useState(0);
  const [address, setAddress] = React.useState("");
  const [accounts, setAccounts] = React.useState([]);

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

      setAccounts(accounts);
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

  const transferToken = async () => {
    setLoading(true);

    console.log("starting transaction")
    const method = "metaTransfer"
    const reward = 0
    //get the nonce from the contract
    console.log(accounts[0])
    const nonce = await contract.methods.replayNonce(accounts[0]).call()
    console.log("nonce:", nonce)
    //address to, uint256 value, uint256 nonce, uint256 reward

    console.log("add" + address);
    const args = [
      address,
      web3.utils.toTwosComplement(amount),
      web3.utils.toTwosComplement(nonce),
      web3.utils.toTwosComplement(reward)
    ]
    console.log("args:", args)
    //get the hash of the arguments from the contract
    const message = await contract.methods[method + 'Hash'](...args).call()
    console.log("message:", message)
    let sig
    //sign the hash using either the meta account OR the etherless account
    if (accounts[0].privateKey) {
      console.log(accounts[0].privateKey)
      sig = web3.eth.accounts.sign(message, this.state.metaAccount.privateKey);
      sig = sig.signature
    } else {
      sig = await web3.eth.personal.sign("" + message, accounts[0])
    }
    console.log("sig:", sig)
    //package up the details of the POST
    let postData = {
      gas: 100000,
      message: message,
      args: args,
      sig: sig,
      method: method,
    }
    console.log("postData:", postData)
    //post the data to the relayer
    axios.post('http://0.0.0.0:9999/tx', postData, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((response) => {
      console.log("TX RESULT", response.data)
      let hash = response.data.transactionHash
      console.log("adding custom tx with hash", hash)
      //add the custom transaction to the <Transactions/> component
      this.state.customtx(hash, (receipt) => {
        console.log("TX RECEIPT", receipt)
      })
    })
      .catch((error) => {
        console.log(error);
      });

    setLoading(false);
  }

  return (
    <Fragment>
      <CssBaseline />
      <Container fixed>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center">

          <Paper className={classes.paper}>
            {isLoading ? <Loader position="relative" /> :
              <Fragment>
                <TextField
                  id="standard-basic"
                  label="Standard"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  label="amount" />
                <TextField
                  id="standard-bsic"
                  value={address}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={e => setAddress(e.target.value)}
                  label="Address" />
                <br />
                <br />
                <Fab variant="extended" disabled={amount == 0 && address == ""} onClick={() => transferToken()} >
                  Transfer
                </Fab>
              </Fragment>
            }
          </Paper>
        </Grid>
      </Container>
    </Fragment >
  );
};

export default Tranfer;
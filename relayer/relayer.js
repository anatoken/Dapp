"use strict";
const express = require('express');
const helmet = require('helmet');
const app = express();
var cors = require('cors')
const fs = require('fs');
var Web3 = require('web3');

const DESKTOPMINERACCOUNT = 3
let AnatokenContract;
let contract;

const ContractLoader = (contractList, web3) => {
  let contracts = []

  for (let c in contractList) {
    try {
      AnatokenContract = require(`../client/src/contracts/${contractList[c]}.json`)

      const networkId = web3.eth.net.getId();
      const deployedToken = AnatokenContract.networks[5777];

      const instance = new web3.eth.Contract(
        AnatokenContract.abi,
        deployedToken && deployedToken.address,
      );

      console.log(deployedToken.address)

      contract = instance;
    } catch (e) {
      console.log(e)
    }
  }

  return contracts
}

var bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors())

let contracts;

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://0.0.0.0:7545'));

let transactions = {}
let accounts;

web3.eth.getAccounts().then((_accounts) => {
  accounts = _accounts
  console.log("ACCOUNTS", accounts)
})

console.log("LOADING CONTRACTS")
contracts = ContractLoader(["AnaToken"], web3);

app.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  console.log("/")
  res.set('Content-Type', 'application/json');
  res.end(JSON.stringify({ hello: "world" }));

});

app.get('/miner', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  console.log("/miner")
  res.set('Content-Type', 'application/json');
  res.end(JSON.stringify({ address: accounts[DESKTOPMINERACCOUNT] }));
});

app.get('/txs/:account', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  console.log("/txs/" + req.params.account)

  let thisTxsKey = req.params.account.toLowerCase()

  console.log("Getting Transactions for ", thisTxsKey)

  let allTxs = transactions[thisTxsKey]
  let recentTxns = []

  for (let a in allTxs) {
    let age = Date.now() - allTxs[a].time
    if (age < 120000) {
      recentTxns.push(allTxs[a])
    }
  }

  res.set('Content-Type', 'application/json');
  res.end(JSON.stringify(allTxs));
});

app.post('/tx', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  console.log("/tx", req.body)
  console.log("RECOVER:", req.body.message, req.body.sig)
  let account = web3.eth.accounts.recover(req.body.message, req.body.sig).toLowerCase()
  console.log("RECOVERED:", account)
  //if(whitelist.indexOf(account)>=0){
  console.log("Correct sig (whitelisted) ... relay transaction to contract... might want more filtering here, but just blindly do it for now")
  console.log("Forwarding tx to yyyy with local account ", accounts[DESKTOPMINERACCOUNT])
  let txparams = {
    from: accounts[DESKTOPMINERACCOUNT],
    gas: req.body.gas,
    gasPrice: Math.round(4 * 1000000000)
  }
  console.log("calling method", req.body.method, "on contract")

  console.log("TX", req.body.sig, ...req.body.args)
  console.log("PARAMS", txparams)
  contract.methods["" + req.body.method](req.body.sig, ...req.body.args).send(
    txparams, (error, transactionHash) => {
      console.log("TX CALLBACK", error, transactionHash)
      res.set('Content-Type', 'application/json');
      res.end(JSON.stringify({ transactionHash: transactionHash }));
      let fromAddress = account
      if (!transactions[fromAddress]) {
        transactions[fromAddress] = []
      }
      if (transactions[fromAddress].indexOf(transactions) < 0) {
        transactions[fromAddress].push({ hash: transactionHash, time: Date.now(), metatx: true, miner: accounts[DESKTOPMINERACCOUNT] })
      }
    }
  )
    .on('error', (err, receiptMaybe) => {
      console.log("TX ERROR", err, receiptMaybe)
    })
    .on('transactionHash', (transactionHash) => {
      console.log("TX HASH", transactionHash)
    })
    .on('receipt', (receipt) => {
      console.log("TX RECEIPT", receipt)
    })
    .then((receipt) => {
      console.log("TX THEN", receipt)
    })
});

app.listen(9999);

console.log(`http listening on 9999`);
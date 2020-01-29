import React, { Component } from "react";
import axios from "axios";

import AnatokenContract from './contracts/AnaToken.json';
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedToken = AnatokenContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AnatokenContract.abi,
        deployedToken && deployedToken.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  buttonClick = async () => {
      console.log("This will be a custom meta transaction")
      const method = "metaTransfer"
      const reward = 0
      //get the nonce from the contract
      const nonce = await this.state.contract.methods.replayNonce(this.state.accounts[0]).call()
      console.log("nonce:", nonce)
      //address to, uint256 value, uint256 nonce, uint256 reward
      const args = [
        this.state.transferTo,
        this.state.web3.utils.toTwosComplement(this.state.transferAmount),
        this.state.web3.utils.toTwosComplement(nonce),
        this.state.web3.utils.toTwosComplement(reward)
      ]
      console.log("args:",args)
      //get the hash of the arguments from the contract
      const message = await this.state.contract.methods[method+'Hash'](...args).call()
      console.log("message:",message)
      let sig
      //sign the hash using either the meta account OR the etherless account
      if(this.state.accounts[0].privateKey){
        console.log(this.state.accounts[0].privateKey)
        sig = this.state.web3.eth.accounts.sign(message, this.state.metaAccount.privateKey);
        sig = sig.signature
      }else{
        sig = await this.state.web3.eth.personal.sign(""+message,this.state.accounts[0])
      }
      console.log("sig:",sig)
      //package up the details of the POST
      let postData = {
        gas: 100000,
        message: message,
        args:args,
        sig:sig,
        method:method,
      }
      console.log("postData:",postData)
      //post the data to the relayer
      axios.post('http://0.0.0.0:9999/tx', postData, {
        headers: {
            'Content-Type': 'application/json',
        }
      }).then((response)=>{
        console.log("TX RESULT",response.data)
        let hash = response.data.transactionHash
        console.log("adding custom tx with hash",hash)
        //add the custom transaction to the <Transactions/> component
        this.state.customtx(hash,(receipt)=>{
          console.log("TX RECEIPT",receipt)
        })
      })
      .catch((error)=>{
        console.log(error);
      });
    
  }
 
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div className="App">
        <h2>Yo</h2>
        <div>
        Transfer <input
          style={{verticalAlign:"middle",width:50,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
          type="text" name="transferAmount" value={this.state.transferAmount} onChange={t => this.setState({ transferAmount: t.target.value})}
        /> 

        Anatokens to <input
          style={{verticalAlign:"middle",width:300,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
          type="text" name="transferTo" value={this.state.transferTo} onChange={t => this.setState({ transferTo: t.target.value })}
        />
      <button size="2" color="green" onClick={() => this.buttonClick()}>
        Send
      </button>
    </div>
      </div>
    );
  }
}

export default App;

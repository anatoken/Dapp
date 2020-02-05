import Web3 from "web3";

export const isValid = address => {
    const web3 = new Web3();
    try {
        web3.utils.toChecksumAddress(address)
        return true; 
    } catch (e) {
       return false;
    }
}


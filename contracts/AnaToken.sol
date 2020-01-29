pragma solidity >=0.4.21 <0.7.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

 /**
 * @title Anatoken
 */

contract AnaToken is ERC20 {
  string public name = "AnaToken";
  string public symbol = "ANA";
  uint8 public decimals = 0;

  constructor() public {
		_mint(msg.sender, 20000);
  }

  mapping (address => uint256) public replayNonce;

  function metaTransfer(bytes memory signature, address to, uint256 value, uint256 nonce, uint256 reward) public returns (bool) {
    bytes32 metaHash = metaTransferHash(to,value,nonce,reward);
    address signer = getSigner(metaHash,signature);
    
		require(signer!=address(0));
    require(nonce == replayNonce[signer]);
    
		replayNonce[signer]++;
    
		_transfer(signer, to, value);

    if(reward>0){
      _transfer(signer, msg.sender, reward);
    }
  }

  function metaTransferHash(address to, uint256 value, uint256 nonce, uint256 reward) public view returns(bytes32){
    return keccak256(abi.encodePacked(address(this),"metaTransfer", to, value, nonce, reward));
  }

  function getSigner(bytes32 _hash, bytes memory _signature) internal pure returns (address){
    bytes32 r;
    bytes32 s;
    uint8 v;

    if (_signature.length != 65) {
      return address(0);
    }

    assembly {
      r := mload(add(_signature, 32))
      s := mload(add(_signature, 64))
      v := byte(0, mload(add(_signature, 96)))
    }

    if (v < 27) {
      v += 27;
    }

    if (v != 27 && v != 28) {
      return address(0);
    } else {
      return ecrecover(keccak256(
        abi.encodePacked("\x19Ethereum Signed Message:\n32", _hash)
      ), v, r, s);
    }
  }
}
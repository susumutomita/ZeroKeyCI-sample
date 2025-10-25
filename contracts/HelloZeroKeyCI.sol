// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HelloZeroKeyCI
 * @dev デモ用のシンプルなコントラクト
 * ETHOnline 2025 - ZeroKeyCI demonstration
 */
contract HelloZeroKeyCI {
    string public message;
    address public owner;
    uint256 public deployedAt;

    event MessageUpdated(string oldMessage, string newMessage, address updatedBy);

    constructor() {
        message = "Hello from ZeroKeyCI! No private keys in CI/CD!";
        owner = msg.sender;
        deployedAt = block.timestamp;
    }

    function setMessage(string memory _newMessage) public {
        string memory oldMessage = message;
        message = _newMessage;
        emit MessageUpdated(oldMessage, _newMessage, msg.sender);
    }

    function getInfo() public view returns (
        string memory currentMessage,
        address contractOwner,
        uint256 deploymentTime
    ) {
        return (message, owner, deployedAt);
    }
}

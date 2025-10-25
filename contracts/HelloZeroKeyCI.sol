// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title HelloZeroKeyCI
 * @author ZeroKeyCI Team
 * @notice A simple message storage contract demonstrating ZeroKeyCI deployment
 * @dev Demo contract for ETHOnline 2025 - showcasing secure CI/CD without private keys
 */
contract HelloZeroKeyCI is Ownable {
    /// @notice The current stored message
    string public message;

    /// @notice Timestamp when the contract was deployed
    uint256 public deployedAt;

    /// @notice Maximum allowed message length (256 characters)
    uint256 public constant MAX_MESSAGE_LENGTH = 256;

    /**
     * @notice Emitted when the message is updated
     * @param oldMessage The previous message
     * @param newMessage The new message
     * @param updatedBy Address that updated the message
     */
    event MessageUpdated(string oldMessage, string newMessage, address indexed updatedBy);

    /**
     * @notice Contract constructor
     * @dev Sets initial message and deployment timestamp, transfers ownership to deployer
     */
    constructor() Ownable(msg.sender) {
        message = "Hello from ZeroKeyCI! No private keys in CI/CD!";
        deployedAt = block.timestamp;
    }

    /**
     * @notice Updates the stored message
     * @dev Only the contract owner can call this function
     * @param _newMessage The new message to store (1-256 characters)
     * @custom:security Access restricted to owner only
     * @custom:validation Message must be non-empty and within length limits
     */
    function setMessage(string memory _newMessage) public onlyOwner {
        require(bytes(_newMessage).length > 0, "Message cannot be empty");
        require(bytes(_newMessage).length <= MAX_MESSAGE_LENGTH, "Message exceeds maximum length");

        string memory oldMessage = message;
        message = _newMessage;

        emit MessageUpdated(oldMessage, _newMessage, msg.sender);
    }

    /**
     * @notice Retrieves all contract information
     * @return currentMessage The current stored message
     * @return contractOwner The address of the contract owner
     * @return deploymentTime The timestamp when contract was deployed
     */
    function getInfo() public view returns (
        string memory currentMessage,
        address contractOwner,
        uint256 deploymentTime
    ) {
        return (message, owner(), deployedAt);
    }
}

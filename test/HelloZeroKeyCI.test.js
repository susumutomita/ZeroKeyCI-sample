const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HelloZeroKeyCI", function () {
  let HelloZeroKeyCI;
  let contract;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy contract
    HelloZeroKeyCI = await ethers.getContractFactory("HelloZeroKeyCI");
    contract = await HelloZeroKeyCI.deploy();
  });

  describe("Deployment", function () {
    it("Should set the correct initial message", async function () {
      expect(await contract.message()).to.equal(
        "Hello from ZeroKeyCI! No private keys in CI/CD!"
      );
    });

    it("Should set the deployer as owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should set deployment timestamp", async function () {
      const deployedAt = await contract.deployedAt();
      expect(deployedAt).to.be.gt(0);
    });

    it("Should return correct info via getInfo()", async function () {
      const [message, contractOwner, deploymentTime] = await contract.getInfo();

      expect(message).to.equal("Hello from ZeroKeyCI! No private keys in CI/CD!");
      expect(contractOwner).to.equal(owner.address);
      expect(deploymentTime).to.be.gt(0);
    });
  });

  describe("Access Control", function () {
    it("Should allow owner to update message", async function () {
      await contract.setMessage("New message from owner");
      expect(await contract.message()).to.equal("New message from owner");
    });

    it("Should reject non-owner attempts to update message", async function () {
      await expect(
        contract.connect(addr1).setMessage("Unauthorized message")
      ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
    });

    it("Should allow ownership transfer", async function () {
      await contract.transferOwnership(addr1.address);
      expect(await contract.owner()).to.equal(addr1.address);
    });

    it("Should allow new owner to update message after transfer", async function () {
      await contract.transferOwnership(addr1.address);
      await contract.connect(addr1).setMessage("Message from new owner");
      expect(await contract.message()).to.equal("Message from new owner");
    });
  });

  describe("Input Validation", function () {
    it("Should reject empty messages", async function () {
      await expect(
        contract.setMessage("")
      ).to.be.revertedWith("Message cannot be empty");
    });

    it("Should reject messages exceeding maximum length", async function () {
      const longMessage = "a".repeat(257); // MAX_MESSAGE_LENGTH + 1
      await expect(
        contract.setMessage(longMessage)
      ).to.be.revertedWith("Message exceeds maximum length");
    });

    it("Should accept message at maximum length", async function () {
      const maxMessage = "a".repeat(256); // Exactly MAX_MESSAGE_LENGTH
      await contract.setMessage(maxMessage);
      expect(await contract.message()).to.equal(maxMessage);
    });

    it("Should accept single character message", async function () {
      await contract.setMessage("a");
      expect(await contract.message()).to.equal("a");
    });
  });

  describe("Events", function () {
    it("Should emit MessageUpdated event on message change", async function () {
      const oldMessage = await contract.message();
      const newMessage = "Updated message";

      await expect(contract.setMessage(newMessage))
        .to.emit(contract, "MessageUpdated")
        .withArgs(oldMessage, newMessage, owner.address);
    });

    it("Should emit event with correct updater address", async function () {
      await contract.transferOwnership(addr1.address);
      const newMessage = "Message from addr1";

      await expect(contract.connect(addr1).setMessage(newMessage))
        .to.emit(contract, "MessageUpdated")
        .withArgs(
          "Hello from ZeroKeyCI! No private keys in CI/CD!",
          newMessage,
          addr1.address
        );
    });
  });

  describe("Message Updates", function () {
    it("Should update message multiple times", async function () {
      await contract.setMessage("First update");
      expect(await contract.message()).to.equal("First update");

      await contract.setMessage("Second update");
      expect(await contract.message()).to.equal("Second update");

      await contract.setMessage("Third update");
      expect(await contract.message()).to.equal("Third update");
    });

    it("Should preserve deployment timestamp after message updates", async function () {
      const originalTimestamp = await contract.deployedAt();

      await contract.setMessage("Updated message");

      expect(await contract.deployedAt()).to.equal(originalTimestamp);
    });

    it("Should handle special characters in messages", async function () {
      const specialMessage = "Hello! @#$%^&*() 123";
      await contract.setMessage(specialMessage);
      expect(await contract.message()).to.equal(specialMessage);
    });
  });

  describe("View Functions", function () {
    it("Should return correct MAX_MESSAGE_LENGTH constant", async function () {
      expect(await contract.MAX_MESSAGE_LENGTH()).to.equal(256);
    });

    it("Should allow anyone to read the message", async function () {
      const message = await contract.connect(addr1).message();
      expect(message).to.equal("Hello from ZeroKeyCI! No private keys in CI/CD!");
    });

    it("Should allow anyone to call getInfo()", async function () {
      const [message, contractOwner, deploymentTime] = await contract.connect(addr2).getInfo();

      expect(message).to.equal("Hello from ZeroKeyCI! No private keys in CI/CD!");
      expect(contractOwner).to.equal(owner.address);
      expect(deploymentTime).to.be.gt(0);
    });
  });
});

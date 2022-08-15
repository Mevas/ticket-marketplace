/* eslint-disable no-unused-expressions */
import { expect } from "chai";
import { CryptoTicket } from "../hardhat/typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
const { ethers } = require("hardhat");

describe("CryptoTicket", () => {
  async function deployTokenFixture() {
    const Deployer = await ethers.getContractFactory("CryptoTicket");
    const [owner, addr1, addr2] = (await ethers.getSigners()) as SignerWithAddress[];

    const contract = (await Deployer.deploy()) as CryptoTicket;
    await contract.deployed();

    return { Deployer, contract, owner, addr1, addr2 };
  }

  describe("Deployment", () => {
    it("Should assign the total supply of tokens to the owner, as in 0", async () => {
      const { contract, owner } = await loadFixture(deployTokenFixture);

      const ownerBalance = await contract.balanceOf(owner.address);
      expect(await contract.totalSupply()).to.equal(ownerBalance);
      expect(await contract.totalSupply()).to.equal(0);
      expect(await contract.hasRole(contract.DEFAULT_ADMIN_ROLE(), owner.address)).to.be.true;
    });
  });

  describe("Minting", () => {
    it("Should fail if the someone who isn't the organizer tries minting", async function () {
      const { contract, addr1 } = await loadFixture(deployTokenFixture);

      // The address is not yet set as the organizer of the event - this happens server-side
      await expect(contract.safeMintForEvent(addr1.address, 10, 0, ethers.utils.parseEther("0.5"))).to.be.revertedWith(
        "Only the organizer is allowed to do this operation"
      );
    });

    it("Should work correctly with addresses other than the deployer", async function () {
      const { contract, addr1, addr2 } = await loadFixture(deployTokenFixture);

      const eventId = 1;
      const organizer = addr1;
      const ticketCount = 10;

      // Set the organizer
      await contract.setOrganizerOfEventId(eventId, organizer.address);
      expect(await contract.eventIdToOrganizer(eventId)).to.equal(organizer.address);

      await contract
        .connect(organizer)
        .safeMintForEvent(addr2.address, ticketCount, eventId, ethers.utils.parseEther("0.5"));
      const eventIds = await Promise.all(
        Array.from(Array(ticketCount).keys()).map((id) => contract.ticketIdToEventId(id))
      );
      eventIds.forEach((id) => expect(id).to.equal(eventId));

      expect(await contract.balanceOf(addr2.address)).to.equal(ticketCount);
      expect(await contract.getTicketPrice(0)).to.equal(ethers.utils.parseEther("0.5"));
      await expect(contract.setTicketPrice(77, ethers.utils.parseEther("0.5"))).to.revertedWithCustomError(
        contract,
        "OwnerQueryForNonexistentToken"
      );
    });

    it("Should emit the correct events", async function () {
      const { contract, owner } = await loadFixture(deployTokenFixture);

      const eventId = 77;

      // Set the organizer
      await contract.setOrganizerOfEventId(eventId, owner.address);

      await expect(contract.safeMintForEvent(owner.address, 2, eventId, ethers.utils.parseEther("0.5")))
        .to.emit(contract, "MintingForEvent")
        .withArgs(eventId)
        .and.to.emit(contract, "Transfer");
    });
  });

  describe("Transactions", () => {
    it("Should be able to change the price of a ticket as an organizer", async function () {
      const { contract, owner, addr1 } = await loadFixture(deployTokenFixture);

      const eventId = 77;
      const organizer = owner;

      await contract.setOrganizerOfEventId(eventId, organizer.address);
      await contract.safeMintForEvent(organizer.address, 10, eventId, ethers.utils.parseEther("0.5"));

      expect(await contract.getTicketPrice(7)).to.equal(ethers.utils.parseEther("0.5"));
      await contract.setTicketPrice(7, ethers.utils.parseEther("1"));
      expect(await contract.getTicketPrice(7)).to.equal(ethers.utils.parseEther("1"));

      await expect(contract.connect(addr1).setTicketPrice(7, ethers.utils.parseEther("7"))).to.be.revertedWith(
        "Only the owner of this ticket is allowed to do this operation"
      );
    });

    it("Should allow the selling and buying of tickets", async function () {
      const { contract: _contract, addr1, addr2 } = await loadFixture(deployTokenFixture);

      const eventId = 77;
      const organizer = addr1;
      const contract = _contract.connect(organizer);

      // Create 2 tickets, of price 0.1 and 0.2 respectively
      await _contract.setOrganizerOfEventId(eventId, organizer.address);
      await contract.safeMintForEvent(organizer.address, 1, eventId, ethers.utils.parseEther("0.1"));
      await _contract.setOrganizerOfEventId(1, organizer.address);
      await contract.safeMintForEvent(organizer.address, 5, 1, ethers.utils.parseEther("0.01"));
      await contract.safeMintForEvent(organizer.address, 1, eventId, ethers.utils.parseEther("0.2"));

      // Expect the balances to be set correctly
      expect(await contract.balanceOf(organizer.address)).to.equal(7);
      expect(await contract.balanceOf(addr2.address)).to.equal(0);

      // Check that the `getFirstAvailableTicketForEvent` function correctly gives the cheapest available ticket
      const cheapestTicket = await contract.getFirstAvailableTicketForEvent(eventId);
      const cheapestTicketPrice = await contract.ticketIdToPrice(cheapestTicket);
      expect(cheapestTicket).to.equal(0);
      expect(cheapestTicketPrice).to.equal(ethers.utils.parseEther("0.1"));
      expect(await contract.isBought(eventId, cheapestTicket)).to.be.false;

      // The organizer shouldn't be allowed to buy his own tickets
      await expect(
        contract.buyTicket(eventId, {
          value: ethers.utils.parseEther("10"),
        })
      ).to.be.revertedWith("Organizer can't buy their own tickets");

      // Make sure the ticket price check is correct
      await expect(
        contract.connect(addr2).buyTicket(eventId, {
          value: ethers.utils.parseEther("0.05"),
        })
      ).to.be.revertedWith("ETH amount too low");

      // Make sure nothing has been set erronously
      expect(await contract.isBought(eventId, cheapestTicket)).to.be.false;
      expect(await contract.balanceOf(organizer.address)).to.equal(7);
      expect(await contract.balanceOf(addr2.address)).to.equal(0);

      // Buy the first ticket, passing its value
      await contract.connect(addr2).buyTicket(eventId, {
        value: cheapestTicketPrice,
      });

      // Check that the ticket has been transferred correctly and that the blaances reflect that
      expect(await contract.isBought(eventId, cheapestTicket)).to.be.true;
      expect(await contract.balanceOf(organizer.address)).to.equal(6);
      expect(await contract.balanceOf(addr2.address)).to.equal(1);
      // Check that the ticket isn't available for buying anymore
      await expect(
        contract.connect(addr2).buyTicket(eventId, {
          value: ethers.utils.parseEther("0.1"),
        })
      ).to.be.revertedWith("ETH amount too low");

      // Check that the new cheapest ticket is correctly set to the 7nd one (because 5 in-between are from another event)
      const newCheapestTicket = await contract.getFirstAvailableTicketForEvent(eventId);
      const newCheapestTicketPrice = await contract.ticketIdToPrice(newCheapestTicket);
      expect(newCheapestTicket).to.equal(6);
      expect(await contract.ticketIdToPrice(newCheapestTicket)).to.equal(ethers.utils.parseEther("0.2"));
      expect(await contract.isBought(eventId, newCheapestTicket)).to.be.false;

      await contract.connect(addr2).buyTicket(eventId, {
        value: newCheapestTicketPrice,
      });

      expect(await contract.isBought(eventId, newCheapestTicket)).to.be.true;
      expect(await contract.balanceOf(organizer.address)).to.equal(5);
      expect(await contract.balanceOf(addr2.address)).to.equal(2);

      await expect(
        contract.connect(addr2).buyTicket(eventId, {
          value: ethers.utils.parseEther("10"),
        })
      ).to.be.revertedWith("No more available tickets");
    });
  });
});

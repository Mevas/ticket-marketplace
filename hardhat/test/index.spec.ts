import { expect } from "chai";
const { ethers } = require("hardhat");

describe("Ticket", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Deployer = await ethers.getContractFactory("Ticket");
    const token = await Deployer.deploy();
    await token.deployed();

    const recipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

    let balance = await token.balanceOf(recipient);
    expect(balance).to.equal(0);

    await token.safeMint(recipient);

    balance = await token.balanceOf(recipient);
    expect(balance).to.equal(1);
    // expect(await token.balanceOf(token.address)).to.equal(7);

    // const setGreetingTx = await token.setGreeting("Hola, mundo!");
    //
    // // wait until the transaction is mined
    // await setGreetingTx.wait();
    //
    // expect(await token.greet()).to.equal("Hola, mundo!");
  });
});

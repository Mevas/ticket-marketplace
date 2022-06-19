import { expect } from "chai";
const { ethers } = require("hardhat");

describe("Ticket", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Deployer = await ethers.getContractFactory("Ticket");
    const token = await Deployer.deploy();
    await token.deployed();

    const [owner, account1, ...otheraccounts] = await ethers.getSigners();
    console.log(owner.address);

    expect(await token.balanceOf(owner.address)).to.equal(0);

    await token.safeMint(owner.address, (await token.totalSupply()) + 1);

    expect(await token.ownerOf(1)).to.equal(owner.address);
    // expect(await token.balanceOf(token.address)).to.equal(7);
    return;

    // const setGreetingTx = await token.setGreeting("Hola, mundo!");
    //
    // // wait until the transaction is mined
    // await setGreetingTx.wait();
    //
    // expect(await token.greet()).to.equal("Hola, mundo!");
  });
});

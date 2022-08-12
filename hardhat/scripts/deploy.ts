/* eslint-disable no-process-exit */
// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
import path from "path";
import { artifacts, ethers, network } from "hardhat";
import { Contract } from "ethers";

const tokenName = "CryptoTicket";

const main = async () => {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory(tokenName);
  const token = await Token.deploy();
  await token.deployed();

  console.log(`${tokenName} address:`, token.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(token);
};

const saveFrontendFiles = (token: Contract) => {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "../../frontend/src/contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ [tokenName]: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync(tokenName);

  fs.writeFileSync(
    contractsDir + `/${tokenName}.json`,
    JSON.stringify(TokenArtifact, null, 2)
  );
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

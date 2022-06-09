const { ethers, run, network } = require("hardhat");
require("dotenv").config();

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");

  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();

  // If deploying to Rinkeby
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting on 6 block confirmations...");
    await simpleStorage.deployTransaction.wait(6); // wait 6 blocks
    verify(simpleStorage.address, {});
  }

  const currentValue = await simpleStorage.retrieve();
  console.log(`Current value is: ${currentValue}.`);

  const transactionResponse = await simpleStorage.store(7);
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`Updated value: ${updatedValue}.`);
}

async function verify(address, constructorArguments) {
  console.log("Verifying contract...");

  try {
    await run("verify:verify", {
      address,
      constructorArguments,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.error(e);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

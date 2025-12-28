const hre = require("hardhat");

async function main() {
  const terraBlock = await hre.ethers.deployContract("TerraBlock");
  await terraBlock.waitForDeployment();
  console.log("TerraBlock deployed to:", terraBlock.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
const hre = require("hardhat");

async function main() {
    const MetaAds = await hre.ethers.getContractFactory("MetaAds");
    const metaAds = await MetaAds.deploy();

    await metaAds.deployed();

    console.log("MyNFT deployed to:", metaAds.address);
    storeContractData(metaAds)
}

function storeContractData(contract) {
    const fs = require("fs");
    const contractsDir = __dirname + "/../src/contracts";
  
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }
  
    fs.writeFileSync(
      contractsDir + "/MetaAds-address.json",
      JSON.stringify({ MetaAds: contract.address }, undefined, 2)
    );
  
    const MetaAdsArtifact = artifacts.readArtifactSync("MetaAds");
  
    fs.writeFileSync(
      contractsDir + "/MetaAds.json",
      JSON.stringify(MetaAdsArtifact, null, 2)
    );
  }


main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
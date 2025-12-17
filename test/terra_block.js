const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TerraBlock", function () {
  let TerraBlock;
  let terraBlock;
  let owner;   // The Government (Deployer)
  let addr1;   // Seller
  let addr2;   // Buyer
  let addrs;

  
  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const TerraBlockFactory = await ethers.getContractFactory("TerraBlock");
    terraBlock = await TerraBlockFactory.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right government owner", async function () {
      expect(await terraBlock.government()).to.equal(owner.address);
    });

    it("Should start with 0 lands", async function () {
      expect(await terraBlock.landCount()).to.equal(0);
    });
  });

  describe("Registration", function () {
    it("Should allow government to register land", async function () {
      await terraBlock.registerLand(
        addr1.address, 
        "26.9124", 
        "75.7873", 
        2400, 
        "QmHash123"
      );

      expect(await terraBlock.landCount()).to.equal(1);
      
      const land = await terraBlock.lands(0);
      expect(land.owner).to.equal(addr1.address);
      expect(land.lat).to.equal("26.9124");
    });

    it("Should FAIL if someone else tries to register", async function () {
      await expect(
        terraBlock.connect(addr1).registerLand(addr1.address, "10.00", "20.00", 1000, "abc")
      ).to.be.revertedWith("Only Govt can register");
    });

    it("Should FAIL if location is already registered", async function () {
      await terraBlock.registerLand(addr1.address, "26.9124", "75.7873", 2400, "QmHash1");
      
      await expect(
        terraBlock.registerLand(addr2.address, "26.9124", "75.7873", 5000, "QmHash2")
      ).to.be.revertedWith("Land at this location already registered");
    });
  });

  describe("Buying and Selling", function () {
    beforeEach(async function () {
      await terraBlock.registerLand(addr1.address, "50.00", "60.00", 1000, "QmBase");
    });

    it("Should allow owner to list land for sale", async function () {
      const price = ethers.parseEther("100");
      await terraBlock.connect(addr1).setLandOpenToSale(0, price);

      const land = await terraBlock.lands(0);
      expect(land.forSale).to.equal(true);
      expect(land.price).to.equal(price);
    });

    it("Should allow buying land", async function () {
      const price = ethers.parseEther("50");
      await terraBlock.connect(addr1).setLandOpenToSale(0, price);

      await terraBlock.connect(addr2).buyLand(0, { value: price });

      const land = await terraBlock.lands(0);
      expect(land.owner).to.equal(addr2.address);
      expect(land.forSale).to.equal(false); 
    });

    it("Should FAIL if payment is too low", async function () {
      const price = ethers.parseEther("50");
      await terraBlock.connect(addr1).setLandOpenToSale(0, price);

      
      await expect(
        terraBlock.connect(addr2).buyLand(0, { value: ethers.parseEther("10") })
      ).to.be.revertedWith("Insufficient funds");
    });
  });

  describe("Transfers (Gifting)", function () {
    it("Should allow owner to transfer land", async function () {
      await terraBlock.registerLand(addr1.address, "80.00", "90.00", 2000, "QmGift");

      await terraBlock.connect(addr1).transferLandOwnership(addr2.address, 0);

      const land = await terraBlock.lands(0);
      expect(land.owner).to.equal(addr2.address);
    });
  });
});
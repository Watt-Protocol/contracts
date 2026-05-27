const { expect } = require("chai");
const hre = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const MAX_SUPPLY = 10_000n * 10n ** 18n;

async function deployAll() {
  const [admin, registrar, minter, producer, stranger, withdrawer] = await hre.ethers.getSigners();

  const MeterRegistry = await hre.ethers.getContractFactory("MeterRegistry");
  const registry = await MeterRegistry.deploy(admin.address);
  await registry.waitForDeployment();

  const WATTToken = await hre.ethers.getContractFactory("WATTToken");
  const token = await WATTToken.deploy(
    admin.address,
    await registry.getAddress(),
    MAX_SUPPLY,
    "WATT Protocol",
    "WATT"
  );
  await token.waitForDeployment();

  const Treasury = await hre.ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy(admin.address, withdrawer.address);
  await treasury.waitForDeployment();

  await registry.connect(admin).grantRole(await registry.REGISTRAR_ROLE(), registrar.address);
  await token.connect(admin).grantRole(await token.MINTER_ROLE(), minter.address);
  await token.connect(admin).revokeRole(await token.MINTER_ROLE(), admin.address);

  return {
    admin,
    registrar,
    minter,
    producer,
    stranger,
    withdrawer,
    registry,
    token,
    treasury,
  };
}

describe("MeterRegistry", function () {
  it("registrar can register and deactivate; stranger cannot", async function () {
    const { registry, admin, registrar, stranger } = await loadFixture(deployAll);
    const meterId = hre.ethers.id("meter-1");

    await expect(registry.connect(stranger).registerMeter(meterId, "ipfs://a")).to.be.revertedWithCustomError(
      registry,
      "AccessControlUnauthorizedAccount"
    );

    await registry.connect(registrar).registerMeter(meterId, "ipfs://a");
    expect(await registry.isMeterActive(meterId)).to.equal(true);

    await registry.connect(registrar).deactivateMeter(meterId);
    expect(await registry.isMeterActive(meterId)).to.equal(false);

    await registry.connect(registrar).reactivateMeter(meterId);
    expect(await registry.isMeterActive(meterId)).to.equal(true);

    const [, , uri] = await registry.getMeter(meterId);
    expect(uri).to.equal("ipfs://a");
  });

  it("rejects duplicate register", async function () {
    const { registry, registrar } = await loadFixture(deployAll);
    const meterId = hre.ethers.id("meter-dup");
    await registry.connect(registrar).registerMeter(meterId, "");
    await expect(registry.connect(registrar).registerMeter(meterId, "")).to.be.revertedWithCustomError(
      registry,
      "MeterAlreadyExists"
    );
  });
});

describe("WATTToken", function () {
  it("minter can mint up to cap; exceeds max reverts", async function () {
    const { token, minter, producer } = await loadFixture(deployAll);
    await token.connect(minter).mint(producer.address, MAX_SUPPLY - 1n);
    await expect(token.connect(minter).mint(producer.address, 2n)).to.be.revertedWithCustomError(token, "ExceedsMaxSupply");
  });

  it("mintForVerifiedEnergy requires active meter", async function () {
    const { token, registry, registrar, minter, producer } = await loadFixture(deployAll);
    const meterId = hre.ethers.id("live-meter");
    await registry.connect(registrar).registerMeter(meterId, "ipfs://m");

    await token.connect(minter).mintForVerifiedEnergy(meterId, producer.address, 3n);
    expect(await token.balanceOf(producer.address)).to.equal(3n * 10n ** 18n);

    await registry.connect(registrar).deactivateMeter(meterId);
    await expect(
      token.connect(minter).mintForVerifiedEnergy(meterId, producer.address, 1n)
    ).to.be.revertedWithCustomError(token, "InactiveMeter");
  });

  it("pauser can pause and block mint", async function () {
    const { token, admin, minter, producer, registry, registrar } = await loadFixture(deployAll);
    const meterId = hre.ethers.id("m-pause");
    await registry.connect(registrar).registerMeter(meterId, "");
    await token.connect(admin).pause();
    await expect(token.connect(minter).mint(producer.address, 1n)).to.be.revertedWithCustomError(
      token,
      "EnforcedPause"
    );
    await token.connect(admin).unpause();
    await token.connect(minter).mint(producer.address, 1n);
  });
});

describe("Treasury", function () {
  it("withdraws native and ERC20 with role", async function () {
    const { treasury, admin, stranger, withdrawer, token, minter, producer } = await loadFixture(deployAll);

    await token.connect(minter).mint(await treasury.getAddress(), 100n * 10n ** 18n);

    await expect(
      treasury.connect(stranger).withdrawNative(producer.address, 1n)
    ).to.be.revertedWithCustomError(treasury, "AccessControlUnauthorizedAccount");

    await admin.sendTransaction({ to: await treasury.getAddress(), value: hre.ethers.parseEther("0.01") });

    const before = await hre.ethers.provider.getBalance(producer.address);
    await treasury.connect(withdrawer).withdrawNative(producer.address, hre.ethers.parseEther("0.005"));
    const after = await hre.ethers.provider.getBalance(producer.address);
    expect(after - before).to.equal(hre.ethers.parseEther("0.005"));

    await treasury.connect(withdrawer).withdrawERC20(await token.getAddress(), producer.address, 10n * 10n ** 18n);
    expect(await token.balanceOf(producer.address)).to.equal(10n * 10n ** 18n);
  });
});

describe("Integration", function () {
  it("register meter then mint verified energy then fund treasury", async function () {
    const { registry, token, treasury, registrar, minter, producer } = await loadFixture(deployAll);
    const meterId = hre.ethers.id("integration-meter");
    await registry.connect(registrar).registerMeter(meterId, "ipfs://proof");
    await token.connect(minter).mintForVerifiedEnergy(meterId, producer.address, 5n);
    await token.connect(producer).transfer(await treasury.getAddress(), 5n * 10n ** 18n);
    expect(await token.balanceOf(await treasury.getAddress())).to.equal(5n * 10n ** 18n);
  });
});

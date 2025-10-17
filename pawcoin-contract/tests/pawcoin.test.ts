import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

const contractName = "pawcoin";

describe("Pawcoin Token Contract", () => {
  
  describe("Token Metadata", () => {
    it("should return correct token name", () => {
      const { result } = simnet.callReadOnlyFn(contractName, "get-name", [], deployer);
      expect(result).toBeOk("Pawcoin");
    });

    it("should return correct token symbol", () => {
      const { result } = simnet.callReadOnlyFn(contractName, "get-symbol", [], deployer);
      expect(result).toBeOk("PAW");
    });

    it("should return correct decimals", () => {
      const { result } = simnet.callReadOnlyFn(contractName, "get-decimals", [], deployer);
      expect(result).toBeOk(6);
    });

    it("should return token URI", () => {
      const { result } = simnet.callReadOnlyFn(contractName, "get-token-uri", [], deployer);
      expect(result).toBeOk("https://pawcoin.dog/metadata.json");
    });

    it("should return contract owner", () => {
      const { result } = simnet.callReadOnlyFn(contractName, "get-contract-owner", [], deployer);
      expect(result).toBePrincipal(deployer);
    });
  });

  describe("Initial Supply", () => {
    it("should have correct total supply", () => {
      const { result } = simnet.callReadOnlyFn(contractName, "get-total-supply", [], deployer);
      expect(result).toBeOk(1000000000000000); // 1 billion with 6 decimals
    });

    it("deployer should have initial supply", () => {
      const { result } = simnet.callReadOnlyFn(contractName, "get-balance", [simnet.types.principal(deployer)], deployer);
      expect(result).toBeOk(1000000000000000);
    });

    it("other wallets should have zero balance initially", () => {
      const { result } = simnet.callReadOnlyFn(contractName, "get-balance", [simnet.types.principal(wallet1)], deployer);
      expect(result).toBeOk(0);
    });
  });

  describe("Transfer Function", () => {
    it("should allow token holder to transfer tokens", () => {
      const transferAmount = 1000000; // 1 PAW (with 6 decimals)
      
      const { result } = simnet.callPublicFn(
        contractName,
        "transfer",
        [
          simnet.types.uint(transferAmount),
          simnet.types.principal(deployer),
          simnet.types.principal(wallet1),
          simnet.types.none()
        ],
        deployer
      );
      
      expect(result).toBeOk(true);
      
      // Check balances after transfer
      const recipientBalance = simnet.callReadOnlyFn(contractName, "get-balance", [simnet.types.principal(wallet1)], deployer);
      expect(recipientBalance.result).toBeOk(transferAmount);
    });

    it("should reject transfer from non-owner", () => {
      const transferAmount = 1000000;
      
      const { result } = simnet.callPublicFn(
        contractName,
        "transfer",
        [
          simnet.types.uint(transferAmount),
          simnet.types.principal(deployer),
          simnet.types.principal(wallet2),
          simnet.types.none()
        ],
        wallet1 // wallet1 trying to transfer deployer's tokens
      );
      
      expect(result).toBeErr(101); // err-not-token-owner
    });

    it("should reject transfer of zero amount", () => {
      const { result } = simnet.callPublicFn(
        contractName,
        "transfer",
        [
          simnet.types.uint(0),
          simnet.types.principal(deployer),
          simnet.types.principal(wallet1),
          simnet.types.none()
        ],
        deployer
      );
      
      expect(result).toBeErr(103); // err-invalid-amount
    });
  });

  describe("Mint Function", () => {
    it("should allow owner to mint tokens", () => {
      const mintAmount = 5000000; // 5 PAW
      
      const { result } = simnet.callPublicFn(
        contractName,
        "mint",
        [
          simnet.types.uint(mintAmount),
          simnet.types.principal(wallet1)
        ],
        deployer
      );
      
      expect(result).toBeOk(true);
      
      // Check recipient balance
      const balance = simnet.callReadOnlyFn(contractName, "get-balance", [simnet.types.principal(wallet1)], deployer);
      expect(balance.result).toBeOk(mintAmount);
    });

    it("should reject mint from non-owner", () => {
      const { result } = simnet.callPublicFn(
        contractName,
        "mint",
        [
          simnet.types.uint(1000000),
          simnet.types.principal(wallet2)
        ],
        wallet1 // non-owner trying to mint
      );
      
      expect(result).toBeErr(100); // err-owner-only
    });

    it("should reject mint of zero amount", () => {
      const { result } = simnet.callPublicFn(
        contractName,
        "mint",
        [
          simnet.types.uint(0),
          simnet.types.principal(wallet1)
        ],
        deployer
      );
      
      expect(result).toBeErr(103); // err-invalid-amount
    });
  });

  describe("Burn Function", () => {
    it("should allow token holder to burn their tokens", () => {
      // First mint some tokens to wallet1
      simnet.callPublicFn(
        contractName,
        "mint",
        [
          simnet.types.uint(2000000),
          simnet.types.principal(wallet1)
        ],
        deployer
      );
      
      const burnAmount = 500000;
      const { result } = simnet.callPublicFn(
        contractName,
        "burn",
        [simnet.types.uint(burnAmount)],
        wallet1
      );
      
      expect(result).toBeOk(true);
      
      // Check balance after burn
      const balance = simnet.callReadOnlyFn(contractName, "get-balance", [simnet.types.principal(wallet1)], deployer);
      expect(balance.result).toBeOk(1500000); // 2000000 - 500000
    });

    it("should reject burn of zero amount", () => {
      const { result } = simnet.callPublicFn(
        contractName,
        "burn",
        [simnet.types.uint(0)],
        wallet1
      );
      
      expect(result).toBeErr(103); // err-invalid-amount
    });
  });

  describe("Token URI Management", () => {
    it("should allow owner to update token URI", () => {
      const newUri = "https://new.pawcoin.dog/metadata.json";
      
      const { result } = simnet.callPublicFn(
        contractName,
        "set-token-uri",
        [simnet.types.utf8(newUri)],
        deployer
      );
      
      expect(result).toBeOk(true);
      
      // Check if URI was updated
      const uriResult = simnet.callReadOnlyFn(contractName, "get-token-uri", [], deployer);
      expect(uriResult.result).toBeOk(newUri);
    });

    it("should reject URI update from non-owner", () => {
      const { result } = simnet.callPublicFn(
        contractName,
        "set-token-uri",
        [simnet.types.utf8("https://fake.com")],
        wallet1 // non-owner
      );
      
      expect(result).toBeErr(100); // err-owner-only
    });
  });
});

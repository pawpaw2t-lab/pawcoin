# 🐕 Pawcoin (PAW) - A Dog-Themed Cryptocurrency on Stacks

Welcome to Pawcoin, a fun and community-driven cryptocurrency that brings the joy of dogs to the Stacks blockchain! 🐾

## 🌟 Features

- **SIP-010 Compliant**: Fully compatible with the Stacks fungible token standard
- **Dog-Themed**: Celebrating our four-legged friends on the blockchain
- **Mintable**: Owner can mint new tokens as needed
- **Burnable**: Token holders can burn their tokens
- **Transferable**: Standard token transfers with proper authorization
- **Metadata Support**: Configurable token URI for metadata

## 📊 Token Details

- **Name**: Pawcoin
- **Symbol**: PAW
- **Decimals**: 6
- **Initial Supply**: 1,000,000,000 PAW (1 billion tokens)
- **Total Supply**: Dynamic (mintable/burnable)

## 🚀 Quick Start

### Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) installed
- Node.js and npm for testing

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/pawcoin.git
cd pawcoin/pawcoin-contract
```

2. Install dependencies:
```bash
npm install
```

3. Check contract syntax:
```bash
clarinet check
```

4. Run tests:
```bash
npm test
```

### Development

Start a local development environment:
```bash
clarinet console
```

Deploy to testnet:
```bash
clarinet deployment apply -p testnet
```

## 🏗️ Contract Architecture

The Pawcoin contract (`contracts/pawcoin.clar`) implements the SIP-010 fungible token standard with the following key components:

### Core Functions

#### Public Functions
- `transfer(amount, sender, recipient, memo)` - Transfer tokens between accounts
- `mint(amount, recipient)` - Mint new tokens (owner only)
- `burn(amount)` - Burn tokens from caller's balance
- `set-token-uri(new-uri)` - Update token metadata URI (owner only)

#### Read-Only Functions
- `get-name()` - Returns "Pawcoin"
- `get-symbol()` - Returns "PAW"
- `get-decimals()` - Returns 6
- `get-balance(who)` - Get balance for a principal
- `get-total-supply()` - Get current total supply
- `get-token-uri()` - Get current metadata URI
- `get-contract-owner()` - Get contract owner address

### Error Codes
- `u100` - Owner only operation
- `u101` - Not token owner
- `u102` - Insufficient balance
- `u103` - Invalid amount (zero or negative)

## 🧪 Testing

The project includes comprehensive test coverage in `tests/pawcoin.test.ts`:

- Token metadata validation
- Initial supply verification
- Transfer functionality
- Mint operations (owner permissions)
- Burn operations
- URI management
- Error handling

Run the test suite:
```bash
npm test
```

## 📋 Usage Examples

### Basic Token Operations

```typescript
// Get token information
const name = simnet.callReadOnlyFn("pawcoin", "get-name", [], deployer);
const symbol = simnet.callReadOnlyFn("pawcoin", "get-symbol", [], deployer);
const decimals = simnet.callReadOnlyFn("pawcoin", "get-decimals", [], deployer);

// Check balance
const balance = simnet.callReadOnlyFn("pawcoin", "get-balance", 
  [simnet.types.principal(address)], deployer);

// Transfer tokens
const transfer = simnet.callPublicFn("pawcoin", "transfer", [
  simnet.types.uint(1000000), // 1 PAW (6 decimals)
  simnet.types.principal(sender),
  simnet.types.principal(recipient),
  simnet.types.none()
], sender);

// Mint tokens (owner only)
const mint = simnet.callPublicFn("pawcoin", "mint", [
  simnet.types.uint(5000000), // 5 PAW
  simnet.types.principal(recipient)
], owner);

// Burn tokens
const burn = simnet.callPublicFn("pawcoin", "burn", [
  simnet.types.uint(1000000) // 1 PAW
], tokenHolder);
```

## 🚀 Deployment

### Testnet Deployment

1. Configure your testnet settings in `settings/Testnet.toml`
2. Deploy using Clarinet:
```bash
clarinet deployment apply -p testnet
```

### Mainnet Deployment

1. Update `settings/Mainnet.toml` with production settings
2. Deploy to mainnet:
```bash
clarinet deployment apply -p mainnet
```

## 📁 Project Structure

```
pawcoin-contract/
├── contracts/
│   └── pawcoin.clar          # Main token contract
├── tests/
│   └── pawcoin.test.ts       # Comprehensive test suite
├── settings/
│   ├── Devnet.toml          # Development network config
│   ├── Testnet.toml         # Testnet configuration
│   └── Mainnet.toml         # Mainnet configuration
├── Clarinet.toml            # Project configuration
├── package.json             # Node.js dependencies
├── tsconfig.json            # TypeScript configuration
├── vitest.config.js         # Test configuration
└── README.md               # This file
```

## 🤝 Contributing

We welcome contributions to Pawcoin! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run the test suite: `npm test`
5. Submit a pull request

### Development Guidelines

- Follow Clarity best practices
- Write comprehensive tests for new features
- Update documentation as needed
- Use meaningful commit messages

## 🐕 Community

Join the Pawcoin community:

- **Website**: https://pawcoin.dog
- **Twitter**: @PawcoinSTX
- **Discord**: [Join our server](https://discord.gg/pawcoin)
- **Telegram**: @PawcoinCommunity

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

Pawcoin is a fun, community-driven project. This is experimental software and should be used at your own risk. Always do your own research before investing in any cryptocurrency.

## 🙏 Acknowledgments

- Built on [Stacks](https://stacks.co) blockchain
- Powered by [Clarinet](https://github.com/hirosystems/clarinet)
- Inspired by the awesome dog community worldwide 🐕

---

*Made with ❤️ and 🐕 by the Pawcoin team*
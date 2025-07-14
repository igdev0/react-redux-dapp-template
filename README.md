# React-Redux-Hardhat Dapp Template

A monorepo template for building decentralized applications (dapps) with a React frontend and Solidity smart contracts, powered by Yarn workspaces, Hardhat, and modern Web3 tools.

## Technologies

- **[Yarn](https://yarnpkg.com/)**: Fast and reliable package manager for managing dependencies.
- **[React](https://react.dev)**: A JavaScript library for building interactive user interfaces.
- **[TailwindCSS](https://tailwindcss.com)**: A utility-first CSS framework for rapid styling.
- **[shadcn](https://ui.shadcn.com/)**: A collection of customizable, TailwindCSS-based UI components for rapid prototyping.
- **[Redux Toolkit](https://redux-toolkit.js.org/)**: Simplified state management for predictable global state handling.
- **[Solidity](https://soliditylang.org/)**: A programming language for writing Ethereum smart contracts.
- **[Hardhat](http://hardhat.org/)**: A development environment for compiling, testing, and deploying smart contracts.
- **[Wagmi](https://wagmi.sh/)**: React hooks for seamless Ethereum smart contract interactions.
- **[Viem](https://viem.sh/)**: A lightweight Ethereum SDK for robust blockchain interactions.

## Prerequisites

- **Node.js**: Version 22 or higher (specified in `package.json`).
- **Yarn**: Version 3.2.3 or higher (used as the package manager).
- A compatible Ethereum wallet (e.g., MetaMask) for testing and deployment.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd react-redux-dapp-template
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up Git hooks (runs automatically on first install):
   ```bash
   yarn prepare
   ```

## Available Commands

This project uses Yarn workspaces to manage two packages: `dapp` (React frontend) and `hardhat` (smart contracts). Run commands with `yarn <command>`.

### General Commands

Sets up Husky for Git hooks.
```bash
yarn prepare
```

Runs lint-staged to lint and format files before committing.
```bash
yarn precommit
```

### Dapp (Frontend) Commands

Starts the React dapp in development mode with hot reloading.
```bash
yarn dapp:dev
```

Starts the dapp in production mode.
```bash
yarn dapp:start
```

Runs tests for the dapp (e.g., Jest).
```bash
yarn dapp:test
```

Lints the dapp codebase for code style issues.
```bash
yarn dapp:lint
```

Lints and fixes code style issues automatically.
```bash
yarn dapp:lint:fix
```

Runs TypeScript type checking.
```bash
yarn dapp:type-check
```

Formats the dapp codebase (e.g., with Prettier).
```bash
yarn dapp:format
```

Generates Wagmi hooks for smart contract interactions.
```bash
yarn dapp:generate
```

**Note**: Currently formats the codebase; consider updating to build the production bundle.
```bash
yarn dapp:build
```

### Hardhat (Smart Contract) Commands

Displays available Hardhat accounts.
```bash
yarn hardhat:account
```

Imports an account (e.g., private key) into Hardhat.
```bash
yarn hardhat:account-import
```

Reveals an account’s private key (use with caution).
```bash
yarn hardhat:account-reveal
```

Starts a local Hardhat blockchain node.
```bash
yarn hardhat:chain
```

Runs TypeScript type checking for smart contracts.
```bash
yarn hardhat:check-types
```

Removes compiled artifacts and cache.
```bash
yarn hardhat:clean
```

Compiles Solidity smart contracts.
```bash
yarn hardhat:compile
```

Deploys smart contracts to a specified network.
```bash
yarn hardhat:deploy
```

Flattens Solidity contracts into a single file.
```bash
yarn hardhat:flatten
```

Forks a mainnet/testnet blockchain for local testing.
```bash
yarn hardhat:fork
```

Formats the Hardhat codebase (e.g., Solidity files).
```bash
yarn hardhat:format
```

Generates TypeScript types or artifacts for smart contracts.
```bash
yarn hardhat:generate
```

Verifies smart contract source code on a block explorer (e.g., Etherscan).
```bash
yarn hardhat:hardhat-verify
```

Lints the Hardhat codebase.
```bash
yarn hardhat:lint
```

Lints and fixes code style issues automatically.
```bash
yarn hardhat:lint-fix
```

Lints staged files before committing.
```bash
yarn hardhat:lint-staged
```

Runs smart contract tests (e.g., Mocha/Chai).
```bash
yarn hardhat:test
```

Verifies deployed smart contracts on a block explorer.
```bash
yarn hardhat:verify
```

## Project Structure

- `packages/dapp`: React frontend with Redux, TailwindCSS, shadcn, Wagmi, and Viem.
- `packages/hardhat`: Solidity smart contracts with Hardhat for development and deployment.

## Getting Started

1. Start the local Hardhat node:
   ```bash
   yarn hardhat:chain
   ```

2. Compile and deploy smart contracts:
   ```bash
   yarn hardhat:compile
   yarn hardhat:deploy
   ```

3. Generate Wagmi hooks for the dapp:
   ```bash
   yarn dapp:generate
   ```

4. Start the React dapp in development mode:
   ```bash
   yarn dapp:dev
   ```

## License

MIT License. See [LICENSE](LICENSE) for details.


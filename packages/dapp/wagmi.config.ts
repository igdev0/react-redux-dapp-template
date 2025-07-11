import {defineConfig} from '@wagmi/cli';
import {hardhat as hardhatChain} from 'wagmi/chains';
import {hardhat, react} from '@wagmi/cli/plugins';

export default defineConfig({
  out: 'src/shared/hooks/generated.ts',
  contracts: [],
  plugins: [
    hardhat({
      project: "../hardhat",
      deployments: {
        Contract: {
          [hardhatChain.id]: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
        }
      }
    }),
    react()
  ],
});

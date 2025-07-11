import {defineConfig} from '@wagmi/cli';
import {hardhat, react} from '@wagmi/cli/plugins';

export default defineConfig({
  out: 'src/shared/hooks/generated.ts',
  contracts: [
    {
      abi: [],
      name: "erc",
      address: "0x"
    },
  ],
  plugins: [
    hardhat({
      project: "../hardhat"
    }),
    react()
  ],
});

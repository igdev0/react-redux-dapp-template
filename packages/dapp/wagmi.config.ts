import {defineConfig} from '@wagmi/cli';
import {hardhat, react} from '@wagmi/cli/plugins';

export default defineConfig({
  out: 'src/shared/hooks/generated.ts',
  contracts: [],
  plugins: [
    hardhat({
      project: "../hardhat"
    }),
    react()
  ],
});

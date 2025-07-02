import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import {App} from './index.tsx';
import store from "@core/store";
import "./index.css";
import {WagmiProvider} from 'wagmi';
import wagmi from '@core/config/wagmi.ts';
import {QueryClientProvider} from '@tanstack/react-query';
import queryProvider from "@core/config/tanstackQuery";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);

  root.render(
      <StrictMode>
        <WagmiProvider config={wagmi}>
          <QueryClientProvider client={queryProvider}>
            <Provider store={store}>
              <App/>
            </Provider>
          </QueryClientProvider>
        </WagmiProvider>
      </StrictMode>,
  );
} else {
  throw new Error(
      "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  );
}

import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { darkTheme, lightTheme } from "../theme";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { RecoilRoot } from "recoil";

import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { Layout } from "../components/Layout";
import { publicProvider } from "wagmi/providers/public";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";

const { provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.polygon],
  [publicProvider()]
);

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            cacheTime: 1_000 * 60 * 60 * 24, // 24 hours
            networkMode: "offlineFirst",
            refetchOnWindowFocus: false,
            retry: 0,
          },
          mutations: {
            networkMode: "offlineFirst",
          },
        },
      })
  );

  const [client] = useState(() =>
    createClient({
      autoConnect: true,
      provider,
      webSocketProvider,
      queryClient,
    })
  );

  return (
    <NextThemesProvider
      defaultTheme="system"
      attribute="class"
      value={{
        light: lightTheme.className,
        dark: darkTheme.className,
      }}
    >
      <NextUIProvider>
        <RecoilRoot>
          <WagmiConfig client={client}>
            <QueryClientProvider client={queryClient}>
              <Hydrate state={pageProps.dehydratedState}>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </Hydrate>
            </QueryClientProvider>
          </WagmiConfig>
        </RecoilRoot>
      </NextUIProvider>
    </NextThemesProvider>
  );
};

export default MyApp;

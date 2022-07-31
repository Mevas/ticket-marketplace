import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { darkTheme, lightTheme } from "../theme";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { RecoilRoot } from "recoil";

import { createClient, WagmiConfig } from "wagmi";
import { Layout } from "../components/Layout";

const client = createClient({
  autoConnect: true,
});

const MyApp = ({ Component, pageProps }: AppProps) => (
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
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </WagmiConfig>
      </RecoilRoot>
    </NextUIProvider>
  </NextThemesProvider>
);

export default MyApp;

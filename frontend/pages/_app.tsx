import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { darkTheme, lightTheme } from "../theme";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Layout } from "../components/Layout";

import { createClient, WagmiConfig } from "wagmi";

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
      <WagmiConfig client={client}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WagmiConfig>
    </NextUIProvider>
  </NextThemesProvider>
);

export default MyApp;

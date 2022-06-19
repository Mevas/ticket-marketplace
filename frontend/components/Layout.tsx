import React from "react";
import { Navbar } from "./Navbar";

export const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

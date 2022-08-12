import React from "react";
import { Navbar } from "./Navbar";
import { Container } from "@nextui-org/react";

export const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <>
      <Navbar />
      <Container display="flex" css={{ mt: "$xl" }}>
        {children}
      </Container>
    </>
  );
};

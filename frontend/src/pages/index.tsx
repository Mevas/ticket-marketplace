import type { NextPage } from "next";
import { Container } from "@nextui-org/react";
import dynamic from "next/dynamic";

const Account = dynamic<{}>(
  () => import("../components/Account").then((mod) => mod.Account),
  { ssr: false }
);

const Home: NextPage = () => {
  return (
    <Container display="flex" justify="center" css={{ mt: "$xl" }}>
      <Account />
    </Container>
  );
};

export default Home;

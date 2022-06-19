import type { NextPage } from "next";
import { Container } from "@nextui-org/react";
import { Account } from "../components/Account";

const Home: NextPage = () => {
  return (
    <Container display="flex" justify="center" css={{ mt: "$xl" }}>
      <Account />
    </Container>
  );
};

export default Home;

import type { NextPage } from "next";
import { Button } from "@nextui-org/react";
import { useTheme as useNextTheme } from "next-themes";
import { Switch, useTheme } from "@nextui-org/react";
import { Container, Card, Row, Text } from "@nextui-org/react";

const Home: NextPage = () => {
  const { setTheme } = useNextTheme();
  const { isDark, type } = useTheme();

  return (
    <Container>
      <div>
        The current theme is: {type}
        <Switch
          checked={isDark}
          onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
        />
      </div>
      <Button>Hello</Button>
    </Container>
  );
};

export default Home;

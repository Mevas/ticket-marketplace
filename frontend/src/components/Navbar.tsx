import React from "react";
import { Button, Container, Row, Text } from "@nextui-org/react";
import { ThemeToggle } from "./ThemeToggle";

export const Navbar = () => {
  return (
    <Container lg as="nav" display="flex" wrap="nowrap">
      <Row justify="space-between" align="center">
        <Text h1>TicketMart</Text>

        <div style={{ display: "flex", gap: "32px" }}>
          <Button>Create event</Button>
          <ThemeToggle />
        </div>
      </Row>
    </Container>
  );
};

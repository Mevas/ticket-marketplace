import React from "react";
import { Button, Container, Row, Text } from "@nextui-org/react";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";

export const Navbar = () => {
  return (
    <Container lg as="nav" display="flex" wrap="nowrap">
      <Row justify="space-between" align="center">
        <Link href="/">
          <Text h1 css={{ cursor: "pointer" }}>
            TicketMart
          </Text>
        </Link>

        <div style={{ display: "flex", gap: "32px" }}>
          <Link href="/events/new">
            <Button>Create event</Button>
          </Link>

          <ThemeToggle />
        </div>
      </Row>
    </Container>
  );
};

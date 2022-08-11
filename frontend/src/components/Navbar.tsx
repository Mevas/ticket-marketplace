import React from "react";
import { Button, Container, Row, Text } from "@nextui-org/react";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";

export const Navbar = () => {
  return (
    <Container lg as="nav" display="flex" wrap="nowrap">
      <Row justify="space-between" align="center">
        <Text h1>TicketMart</Text>

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

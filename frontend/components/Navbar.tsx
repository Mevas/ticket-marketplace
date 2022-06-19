import React from "react";
import { Container, Row, Text } from "@nextui-org/react";
import { ThemeToggle } from "./ThemeToggle";
import { Box } from "./Box";

export const Navbar = () => {
  return (
    <Container lg as="nav" display="flex" wrap="nowrap">
      <Row justify="space-between" align="center">
        <Text h1>TicketMart</Text>
        <Box>
          <ThemeToggle />
        </Box>
      </Row>
    </Container>
  );
};

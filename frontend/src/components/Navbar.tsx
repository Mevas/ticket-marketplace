import React from "react";
import { Button, Container, Row, Text } from "@nextui-org/react";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";
import { ConnectButton } from "./ConnectButton";
import { useIsMounted } from "../hooks/use-is-mounted";
import { useUser } from "../hooks/useUser";

export const Navbar = () => {
  const isMounted = useIsMounted();
  const user = useUser();

  return (
    <Container lg as="nav" display="flex" wrap="nowrap">
      <Row justify="space-between" align="center">
        <Link href="/">
          <Text h1 css={{ cursor: "pointer" }}>
            TicketMart
          </Text>
        </Link>

        <div style={{ display: "flex", gap: "32px" }}>
          {user.isLoggedIn && (
            <>
              <Link href="/tickets">
                <Button rounded color="gradient">
                  My tickets
                </Button>
              </Link>

              <Link href="/events/new">
                <Button rounded>Create event</Button>
              </Link>
            </>
          )}

          {isMounted && <ConnectButton />}

          <ThemeToggle />
        </div>
      </Row>
    </Container>
  );
};

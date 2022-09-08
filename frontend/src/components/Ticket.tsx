import { Button, Card, Text, useTheme } from "@nextui-org/react";
import React, { useState } from "react";
import { Ticket as TicketType } from "../types";
import QRCode from "react-qr-code";
import { useSigner } from "wagmi";
import { Box } from "./Box";
import Link from "next/link";

export type TicketProps = {
  ticket: TicketType;
};

export const Ticket = ({ ticket }: TicketProps) => {
  const { isDark } = useTheme();
  const { data: signer } = useSigner();

  const [message, setMessage] = useState<string | null>(null);
  const getMessage = async () => {
    if (!signer) {
      return;
    }

    const message = ticket.id.toString();
    const signedMessage = await signer?.signMessage(message);

    const encodedMesasge = `http://localhost:9000/tickets/verify/${new Buffer(
      JSON.stringify({
        message,
        signedMessage,
      })
    ).toString("base64")}`;

    setMessage(encodedMesasge);
  };

  return (
    <Card isHoverable>
      <Card.Header
        css={{
          position: "absolute",
          zIndex: 1,
          top: 0,
          right: 0,
          left: 12,
          display: "grid",
        }}
      >
        <Text h2>{ticket.event.title}</Text>
        <Text h4 i>
          {ticket.tier} ticket
        </Text>

        <Text h2 i style={{ position: "absolute", top: 12, right: 48 }}>
          #{ticket.id}
        </Text>
      </Card.Header>

      <Card.Body
        css={{
          p: 0,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            top: 0,
            left: 0,
            background: `linear-gradient(to top, ${
              isDark
                ? "rgba(20,20,20,1) 40%, rgba(20,20,20,0)"
                : "rgba(255,255,255,1) 40%, rgba(255,255,255,0)"
            })`,
            zIndex: 1,
          }}
        />
        {ticket.art && (
          <Card.Image
            src={ticket.art}
            width="100%"
            height="100%"
            objectFit="cover"
            alt={`Ticket ${ticket.id} cover image`}
            css={{
              aspectRatio: 9 / 16,
            }}
          />
        )}
      </Card.Body>

      <Card.Footer
        css={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 1 }}
      >
        {message ? (
          <Box
            style={{
              backgroundColor: isDark ? "black" : "white",
              padding: "8px 8px 3px 8px",
              borderRadius: 8,
              height: "auto",
              width: "100%",
              cursor: "pointer",
            }}
          >
            <Link href={message}>
              <QRCode
                value={message}
                style={{
                  height: "auto",
                  maxWidth: "100%",
                  width: "100%",
                  filter: isDark ? "invert(1)" : undefined,
                }}
                // @ts-ignore
                viewBox={`0 0 256 256`}
              />
            </Link>
          </Box>
        ) : (
          <Button style={{ width: "100%" }} onPress={getMessage}>
            Show QR code
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
};

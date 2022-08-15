import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, Text, useTheme } from "@nextui-org/react";
import { Event } from "../types";
import { useUser } from "../hooks/useUser";
import Link from "next/link";
import { useEvent } from "../hooks/use-event";
import { isFirefox } from "react-device-detect";
import { useTicketContract } from "../hooks/use-ticket-contract";
import { ethers } from "ethers";
import { useTickets } from "../hooks/use-tickets";
import { Price } from "./Price";

export type EventCardProps = {
  event: Event;
};

export const EventCard = ({ event: _event }: EventCardProps) => {
  const user = useUser();
  const isOrganizer = user.id === _event.organizerId;
  const { event: adminEvent } = useEvent(_event.id, {
    enabled: isOrganizer,
  });
  const contract = useTicketContract();
  const { isDark } = useTheme();

  const event = { ..._event, ...adminEvent };

  const tickets = useTickets();
  const hasTicketsForEvent = tickets?.find(
    (ticket) => ticket.eventId === event.id
  );

  const [price, setPrice] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const price = await contract.getEventPrice(event.id);
        setPrice(ethers.utils.formatEther(price));
      } catch (e) {
        console.log(`Couldn't get price for event ${event.id}`);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, event.id]);

  return (
    <Card isHoverable isPressable>
      <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
        <Col>
          <Text h3 color="white">
            {event.title}
          </Text>

          <Text size={12} weight="bold" transform="uppercase" color="#222222DD">
            {event.description}
          </Text>
        </Col>
      </Card.Header>

      <Card.Body css={{ p: 0 }}>
        <Card.Image
          src="https://weraveyou.com/wp-content/uploads/2022/07/Tomorrowland-2022-01.jpg"
          width="100%"
          height="100%"
          objectFit="cover"
          alt={`${event.title} cover image`}
        />
      </Card.Body>

      <Card.Footer
        isBlurred={!isFirefox}
        css={
          !isFirefox
            ? {
                position: "absolute",
                bgBlur: "#ffffff66",
                bgColor: isDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)",
                borderTop:
                  "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
                bottom: 0,
                zIndex: 1,
              }
            : undefined
        }
      >
        <Col>
          <Row justify="space-between" align="center">
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div>
                {isOrganizer ? (
                  <>
                    {event.ticketSold !== undefined && (
                      <Text color={!isFirefox ? "white" : undefined} h6>
                        {event.ticketSold} / {event.ticketCount} tickets sold
                      </Text>
                    )}
                  </>
                ) : (
                  price && (
                    <>
                      <div>
                        <Price price={price} currency="ETH" />
                      </div>
                    </>
                  )
                )}
              </div>
            </div>

            {isOrganizer ? (
              <Link href={`/events/${event.id}`}>
                <Button flat auto rounded color="primary">
                  <Text
                    css={{ color: "inherit" }}
                    size={12}
                    weight="bold"
                    transform="uppercase"
                  >
                    Manage
                  </Text>
                </Button>
              </Link>
            ) : !hasTicketsForEvent ? (
              <Button
                flat
                auto
                rounded
                color="secondary"
                disabled={event.soldOut}
                onPress={async () => {
                  await contract.buyTicket(event.id, {
                    value: await contract.getEventPrice(event.id),
                  });
                }}
              >
                <Text
                  css={{ color: "inherit" }}
                  size={12}
                  weight="bold"
                  transform="uppercase"
                >
                  {event.soldOut ? "Sold out" : "Buy tickets"}
                </Text>
              </Button>
            ) : (
              hasTicketsForEvent && (
                <Button flat auto rounded color="gradient">
                  <Text
                    css={{ color: "inherit" }}
                    size={12}
                    weight="bold"
                    transform="uppercase"
                  >
                    View Tickets
                  </Text>
                </Button>
              )
            )}
          </Row>
        </Col>
      </Card.Footer>
    </Card>
  );
};

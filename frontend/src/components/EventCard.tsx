import React from "react";
import { Button, Card, Col, Row, Text } from "@nextui-org/react";
import { Event } from "../types";
import { useUser } from "../hooks/useUser";

export type EventCardProps = {
  event: Event;
};

export const EventCard = ({ event }: EventCardProps) => {
  const user = useUser();

  const isOrganizer = user.id === event.organizerId;

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
        isBlurred
        css={{
          position: "absolute",
          bgBlur: "#ffffff66",
          borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
          bottom: 0,
          zIndex: 1,
        }}
      >
        <Col>
          <Row justify="flex-end">
            {isOrganizer ? (
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
            ) : (
              <Button flat auto rounded color="secondary">
                <Text
                  css={{ color: "inherit" }}
                  size={12}
                  weight="bold"
                  transform="uppercase"
                >
                  Buy tickets
                </Text>
              </Button>
            )}
          </Row>
        </Col>
      </Card.Footer>
    </Card>
  );
};

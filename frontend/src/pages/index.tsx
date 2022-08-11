import type { NextPage } from "next";
import {
  Button,
  Card,
  Col,
  Container,
  Grid,
  Row,
  Text,
} from "@nextui-org/react";
import dynamic from "next/dynamic";
import { dehydrate, QueryClient } from "react-query";
import { Box } from "../components/Box";
import { useEvents } from "../hooks/use-events";
import { getEvents } from "../utils/api";

const Account = dynamic<{}>(
  () => import("../components/Account").then((mod) => mod.Account),
  { ssr: false }
);

const Home: NextPage = () => {
  const { data } = useEvents();

  return (
    <Container
      display="flex"
      justify="center"
      direction="column"
      css={{ mt: "$xl" }}
    >
      <Box>
        <Account />
      </Box>

      <Grid.Container gap={2}>
        {data?.map((event, index) => {
          return (
            <Grid xs={3} key={index}>
              <Card isHoverable isPressable>
                <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
                  <Col>
                    <Text h3>{event.title}</Text>

                    <Text
                      size={12}
                      weight="bold"
                      transform="uppercase"
                      color="#222222DD"
                    >
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
                    borderTop:
                      "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
                    bottom: 0,
                    zIndex: 1,
                  }}
                >
                  <Col>
                    <Row justify="flex-end">
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
                    </Row>
                  </Col>
                </Card.Footer>
              </Card>
            </Grid>
          );
        })}
      </Grid.Container>
    </Container>
  );
};

export async function getServerSideProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["events"], getEvents);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default Home;

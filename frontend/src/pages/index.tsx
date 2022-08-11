import type { NextPage } from "next";
import { Container, Grid } from "@nextui-org/react";
import { dehydrate, QueryClient } from "react-query";
import { Box } from "../components/Box";
import { useEvents } from "../hooks/use-events";
import { getEvents } from "../utils/api";
import { EventCard } from "../components/EventCard";
import React from "react";
import { useIsMounted } from "../hooks/use-is-mounted";
import { Account } from "../components/Account";

const Home: NextPage = () => {
  const isMounted = useIsMounted();
  const { data } = useEvents();

  return (
    <Container
      display="flex"
      justify="center"
      direction="column"
      css={{ mt: "$xl" }}
    >
      <Box>{isMounted && <Account />}</Box>

      <Grid.Container gap={2}>
        {data?.map((event, index) => (
          <Grid xs={3} key={index}>
            <EventCard event={event} />
          </Grid>
        ))}
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

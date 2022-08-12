import type { NextPage } from "next";
import { Grid } from "@nextui-org/react";
import { dehydrate, QueryClient } from "react-query";
import { useEvents } from "../hooks/use-events";
import { getEvents } from "../utils/api";
import { EventCard } from "../components/EventCard";
import React from "react";

const Home: NextPage = () => {
  const { data } = useEvents();

  return (
    <>
      <Grid.Container gap={2}>
        {data?.map((event, index) => (
          <Grid xs={3} key={index}>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid.Container>
    </>
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

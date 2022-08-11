import type { NextPage } from "next";
import { Container } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { dehydrate, QueryClient } from "react-query";
import { Box } from "../components/Box";
import { useEvents } from "../hooks/use-events";
import { getEvents } from "../utils/api";

const Account = dynamic<{}>(
  () => import("../components/Account").then((mod) => mod.Account),
  { ssr: false }
);

const getEvents = async () => {
  return (await axiosInstance.get("events")).data;
};

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

      <div>
        <ol>
          {data?.map((event, index) => {
            return <li key={index}>{event.title}</li>;
          })}
        </ol>
      </div>
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

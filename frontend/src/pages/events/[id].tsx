import React from "react";
import { useRouter } from "next/router";
import { Divider, Text } from "@nextui-org/react";
import { Box } from "../../components/Box";
import { useEvent } from "../../hooks/use-event";
import { useForm } from "react-hook-form";
import { Form } from "../../components/forms/Form";
import { useIsMounted } from "../../hooks/use-is-mounted";
import { Account } from "../../components/Account";

export const Event = () => {
  const router = useRouter();
  const { id } = router.query;
  const { event } = useEvent(id ? +id : undefined);
  const isMounted = useIsMounted();

  const methods = useForm({
    defaultValues: event,
  });

  if (!event && isMounted) {
    // router.replace("/");
    return null;
  }

  return (
    <Box
      css={{
        backgroundColor: "$accents0",
        borderRadius: 16,
        justifyContent: "center",
        padding: "$6",
        m: "auto",
        w: "25%",
      }}
    >
      <Text h1>{event?.title}</Text>
      <Box>{isMounted && <Account />}</Box>
      <Form methods={methods}>{/*<FormInput name="title" />*/}</Form>

      <Divider css={{ my: 16 }} />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {" "}
        <Text h4>Total tickets: {event?.ticketCount}</Text>
        <Text h4>Tickets sold: {event?.ticketSold}</Text>
      </div>
    </Box>
  );
};

export default Event;

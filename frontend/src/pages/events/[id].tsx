import React from "react";
import { useRouter } from "next/router";
import { Text } from "@nextui-org/react";
import { Box } from "../../components/Box";
import { useEvent } from "../../hooks/use-event";
import { useForm } from "react-hook-form";
import { Form } from "../../components/forms/Form";
import { FormInput } from "../../components/forms/FormInput";
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
    <Box>
      <Text h1>{event?.title}</Text>
      <Box>{isMounted && <Account />}</Box>
      <Form methods={methods}>
        <FormInput name="title" />
      </Form>

      <div>Total tickets: {event?.ticketCount}</div>
      <div>Tickets sold: {event?.ticketSold}</div>
    </Box>
  );
};

export default Event;

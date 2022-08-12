import React from "react";
import { Button, Loading, Text } from "@nextui-org/react";
import { Box } from "../../components/Box";
import { Form } from "../../components/forms/Form";
import { FormInput } from "../../components/forms/FormInput";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useMutation, useQueryClient } from "react-query";
import { axiosInstance } from "../../utils/auth";
import { useRouter } from "next/router";
import { Event } from "../../types";
import { AxiosError } from "axios";

type EventFormParams = Event;

const CreateEvent = () => {
  const methods = useForm<EventFormParams>();
  const { handleSubmit } = methods;
  const router = useRouter();
  const queryClient = useQueryClient();

  const createEvent = useMutation<Event, AxiosError, EventFormParams>(
    async (data) => {
      return (await axiosInstance.post("events", data)).data;
    },
    {
      onSuccess: async (event) => {
        queryClient.setQueryData<Event[]>(["events"], (oldEvents): Event[] => {
          if (!oldEvents) {
            console.warn("oldEvents was undefined");
            return [];
          }

          return [...oldEvents, event];
        });

        await router.push("/");
      },
    }
  );

  return (
    <Box
      css={{
        backgroundColor: "$accents0",
        borderRadius: 16,
        display: "flex",
        justifyContent: "center",
        padding: "$6",
      }}
    >
      <Text size="$xl4">Create a new event</Text>

      <Form
        onSubmit={handleSubmit(async (values) => {
          createEvent.mutate(values);
        })}
        methods={methods}
      >
        <FormInput placeholder="Title" name="title" required />
        {/*<FormInput placeholder="Name" name="name" required />*/}

        <Link href="/events/new">
          <Button auto flat color="error">
            Cancel
          </Button>
        </Link>

        <Button css={{ minWidth: 130 }} type="submit">
          {createEvent.isLoading ? (
            <Loading type="spinner" color="currentColor" size="sm" />
          ) : (
            "Create event"
          )}
        </Button>
      </Form>
    </Box>
  );
};

export default CreateEvent;

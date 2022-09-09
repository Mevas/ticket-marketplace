import React from "react";
import { Text } from "@nextui-org/react";
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
import { Button } from "../../components/Button";

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
        justifyContent: "center",
        padding: "$6",
        m: "auto",
        w: "25%",
      }}
    >
      <Text size="$xl4">Create a new event</Text>

      <Form
        onSubmit={handleSubmit(async (values) => {
          createEvent.mutate(values);
        })}
        methods={methods}
        style={{ display: "grid", gap: 32, paddingTop: 24 }}
      >
        <FormInput labelPlaceholder="Title" name="title" required />
        <FormInput labelPlaceholder="Description" name="description" required />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Link href="/">
            <Button auto flat color="error">
              Cancel
            </Button>
          </Link>

          <Button
            css={{ minWidth: 130 }}
            type="submit"
            loading={createEvent.isLoading}
          >
            Create event
          </Button>
        </div>
      </Form>
    </Box>
  );
};

export default CreateEvent;

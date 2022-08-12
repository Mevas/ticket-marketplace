import React from "react";
import { Form } from "./forms/Form";
import { Modal, Text } from "@nextui-org/react";
import { FormInput } from "./forms/FormInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "../hooks/useUser";
import { useMutation } from "react-query";
import { axiosInstance } from "../utils/auth";
import { useLocalStorage } from "react-use";
import { AxiosError } from "axios";
import { PrismaError, User } from "../types";
import { Button } from "./Button";
import { AuthFormParams, authFormSchema } from "../utils/forms/authForm";

export const AuthButton = () => {
  const [visible, setVisible] = React.useState(false);
  const closeHandler = () => setVisible(false);
  const user = useUser();
  const [, , removeToken] = useLocalStorage("auth-token");

  const methods = useForm<AuthFormParams>({
    resolver: zodResolver(authFormSchema),
  });
  const { handleSubmit, setError } = methods;

  const createAccount = useMutation<
    User,
    AxiosError<PrismaError<keyof AuthFormParams>>,
    AuthFormParams
  >(
    async (data) => {
      return (await axiosInstance.post("users", data)).data;
    },
    {
      onSuccess: closeHandler,
      onError: (error) => {
        const e = error.response?.data;

        switch (e?.code) {
          // Duplicate field
          case "P2002": {
            e.meta.target.forEach((field) => {
              setError(field, {
                message: `${field} already exists`,
              });
            });
            break;
          }
          default: {
            console.warn(`Error ${e?.code} not handled`, e);
          }
        }
      },
    }
  );

  const handleLogin = async () => {
    const response = await user.logIn();

    if (response?.error?.response?.data.message === "Please create a user") {
      setVisible(true);
    }

    if (response?.error?.response?.data.message === "Token expired") {
      removeToken();
      await handleLogin();
    }
  };

  return (
    <>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Form
          onSubmit={handleSubmit(async (values) => {
            await createAccount.mutate(values);
          })}
          methods={methods}
        >
          <Modal.Header>
            <Text id="modal-title" size={18}>
              Finish creating your account
            </Text>
          </Modal.Header>

          <Modal.Body
            css={{
              display: "grid",
              gap: 16,
              paddingBottom: 24,
            }}
          >
            <FormInput placeholder="Email" name="email" required />
            <FormInput placeholder="Name" name="name" required />
          </Modal.Body>

          <Modal.Footer>
            <Button auto flat color="error" onClick={closeHandler}>
              Close
            </Button>
            <Button
              css={{ minWidth: 130 }}
              type="submit"
              loading={createAccount.isLoading}
            >
              Create account
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Button
        size="lg"
        css={{ width: "100%" }}
        onClick={handleLogin}
        loading={user.isLoggingIn && "Awaiting signature..."}
      >
        Log in
      </Button>
    </>
  );
};

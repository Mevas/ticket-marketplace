import React, { useEffect } from "react";
import { Form } from "./forms/Form";
import { Button, Loading, Modal, Text } from "@nextui-org/react";
import { FormInput } from "./forms/FormInput";
import { useForm } from "react-hook-form";
import { useUser } from "../hooks/useUser";
import { useMutation } from "react-query";
import { axiosInstance, deleteAuthToken } from "../utils/auth";

type AuthFormParams = {
  email: string;
  name: string;
};

export const AuthButton = () => {
  const [visible, setVisible] = React.useState(false);
  const closeHandler = () => setVisible(false);
  const user = useUser();

  const methods = useForm<AuthFormParams>();
  const { handleSubmit } = methods;

  const createAccount = useMutation<unknown, any, AuthFormParams>(
    async (data) => {
      return (await axiosInstance.post("users", data)).data;
    }
  );

  useEffect(() => {
    closeHandler();
  }, [createAccount.isSuccess]);

  const handleLogin = async () => {
    const response = await user.logIn();

    if (response?.error?.response?.data.message === "Please create a user") {
      setVisible(true);
    }

    if (response?.error?.response?.data.message === "Token expired") {
      deleteAuthToken();
      await handleLogin();
    }
  };

  return (
    <div>
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

          <Modal.Body>
            <FormInput placeholder="Email" name="email" required />
            <FormInput placeholder="Name" name="name" required />
          </Modal.Body>

          <Modal.Footer>
            <Button auto flat color="error" onClick={closeHandler}>
              Close
            </Button>
            <Button css={{ minWidth: 130 }} type="submit">
              {createAccount.isLoading ? (
                <Loading type="spinner" color="currentColor" size="sm" />
              ) : (
                "Create account"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {!user.isLoggedIn || !user.email ? (
        <Button onClick={handleLogin}>Log in</Button>
      ) : (
        <Button
          onClick={async () => {
            await user.logOut();
          }}
        >
          Log out
        </Button>
      )}
    </div>
  );
};

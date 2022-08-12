import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Loading,
  Modal,
  Row,
  Spacer,
  Text,
} from "@nextui-org/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { EnsAvatar } from "./EnsAvatar";
import { EnsName } from "./EnsName";
import { useUser } from "../hooks/useUser";
import { Box } from "./Box";
import { FormInput } from "./forms/FormInput";
import { Form } from "./forms/Form";
import { useForm } from "react-hook-form";
import { Button } from "./Button";
import { AuthButton } from "./AuthButton";
import { AuthFormParams, authFormSchema } from "../utils/forms/authForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "react-query";
import { PrismaError, User } from "../types";
import { AxiosError } from "axios";
import { axiosInstance } from "../utils/auth";

export const ConnectButton = () => {
  const account = useAccount();
  const [infoVisible, setInfoVisible] = useState(false);
  const { connect, connectors, ...connection } = useConnect({
    onSuccess: () => {
      setInfoVisible(true);
    },
  });
  const { disconnect } = useDisconnect();
  const user = useUser();
  const [editing, setEditing] = useState(false);
  const queryClient = useQueryClient();

  const handleConnect = () => {
    connect({ connector: connectors[0] });
  };

  const methods = useForm<AuthFormParams>({
    defaultValues: user,
    shouldUnregister: true,
    resolver: zodResolver(authFormSchema),
  });
  const { reset, handleSubmit, setError } = methods;

  const updateUser = useMutation<
    User,
    AxiosError<PrismaError<keyof AuthFormParams>>,
    AuthFormParams
  >(
    async (data) => {
      return (await axiosInstance.patch("users", data)).data;
    },
    {
      onSuccess: (newUser) => {
        queryClient.setQueryData<User>(["me"], (): User | undefined => {
          return newUser;
        });

        setEditing(false);
      },
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

  useEffect(() => {
    reset(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      {account.isConnected && account.address ? (
        <Button
          auto
          rounded
          bordered
          onClick={() => setInfoVisible(true)}
          css={{ position: "relative" }}
        >
          <Row style={{ paddingRight: 20 }}>
            <>
              {user.isLoggedIn && (
                <>
                  {user.name}
                  <Box css={{ px: 10, scale: 2 }}>·</Box>
                </>
              )}
              <EnsName />
            </>
          </Row>

          <div style={{ position: "absolute", right: 10 }}>
            <EnsAvatar size="xs" css={{ cursor: "pointer" }} />
          </div>
        </Button>
      ) : (
        <Button auto rounded bordered onClick={handleConnect}>
          Connect wallet
        </Button>
      )}

      {(connection.isLoading || connection.isError) && (
        <Modal
          aria-label="loading"
          open={connection.isLoading || connection.isError}
          css={{ p: "$lg" }}
          closeButton={connection.isError}
          onClose={() => {
            connection.reset();
          }}
          preventClose={connection.isLoading}
        >
          {connection.isError ? (
            <>
              <Modal.Header>
                <Text h3>Error connecting</Text>
              </Modal.Header>

              <Modal.Body>
                <Row justify="center">
                  <Text css={{ textAlign: "center" }}>
                    The connection attempt failed. Please click try again and
                    follow the steps to connect in your wallet.
                  </Text>
                </Row>
              </Modal.Body>

              <Modal.Footer>
                <Button
                  size="lg"
                  css={{ width: "100%" }}
                  onClick={handleConnect}
                >
                  Try again
                </Button>
              </Modal.Footer>
            </>
          ) : (
            <Modal.Body>
              <Col>
                <Row justify="center">
                  <Loading type="spinner" color="currentColor" size="xl" />
                </Row>
                <Spacer y={0.5} />
                <Row justify="center">Connecting...</Row>
              </Col>
            </Modal.Body>
          )}
        </Modal>
      )}

      {account.isConnected && (
        <Modal
          closeButton
          aria-labelledby="modal-title"
          open={infoVisible}
          onClose={() => {
            setInfoVisible(false);
            setEditing(false);
          }}
        >
          <Modal.Header css={{ position: "absolute", top: 0 }}>
            <Text size={16} transform="uppercase">
              Account
            </Text>
          </Modal.Header>

          <Modal.Body css={{ mb: "$sm", mt: "$lg" }}>
            <Card variant="bordered" css={{ background: "$accents1" }}>
              <Card.Header>
                <Row justify="space-between">
                  Connected with {account.connector?.name}
                  <Button
                    size="xs"
                    color="error"
                    bordered
                    onClick={() => {
                      setInfoVisible(false);
                      disconnect();
                      user.logOut();
                    }}
                  >
                    Disconnect
                  </Button>
                </Row>
              </Card.Header>

              <Card.Divider />

              <Card.Body>
                <Row justify="center" align="center">
                  <EnsAvatar />
                  <Spacer x={1} />
                  <Text size={20} weight="bold" css={{ letterSpacing: 0.5 }}>
                    <EnsName />
                  </Text>
                </Row>
              </Card.Body>
            </Card>

            {user.isLoggedIn ? (
              <Card variant="bordered" css={{ background: "$accents1" }}>
                <Form
                  methods={methods}
                  onSubmit={handleSubmit((data) => {
                    updateUser.mutate(data);
                  })}
                >
                  <Card.Header>
                    <Row justify="flex-end">
                      <div style={{ display: "flex", gap: 16 }}>
                        {editing ? (
                          <Button
                            size="xs"
                            color="success"
                            bordered
                            type="submit"
                            key="save"
                            loading={updateUser.isLoading}
                          >
                            Save
                          </Button>
                        ) : (
                          <Button
                            size="xs"
                            color="primary"
                            bordered
                            type="button"
                            onClick={() => setEditing(true)}
                            key="edit"
                          >
                            Edit
                          </Button>
                        )}

                        {editing ? (
                          <Button
                            size="xs"
                            color="error"
                            bordered
                            onClick={() => {
                              setEditing(false);
                              reset(user);
                            }}
                            disabled={updateUser.isLoading}
                          >
                            Cancel
                          </Button>
                        ) : (
                          <Button
                            size="xs"
                            color="error"
                            bordered
                            onClick={user.logOut}
                          >
                            Log out
                          </Button>
                        )}
                      </div>
                    </Row>
                  </Card.Header>

                  <Card.Divider />

                  <Card.Body>
                    <div
                      style={{
                        display: "grid",
                        gap: 24,
                        marginBottom: 8,
                      }}
                    >
                      <FormInput
                        label="Email"
                        placeholder="johndoe@gmail.com"
                        name="email"
                        required
                        readOnly={!editing}
                        clearable={editing}
                        bordered={editing}
                      />

                      <FormInput
                        label="Name"
                        placeholder="John Doe"
                        name="name"
                        required
                        readOnly={!editing}
                        clearable={editing}
                        bordered={editing}
                      />
                    </div>
                  </Card.Body>
                </Form>
              </Card>
            ) : (
              <AuthButton />
            )}
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

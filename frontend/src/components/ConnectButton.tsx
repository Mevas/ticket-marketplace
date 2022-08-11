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
import { User } from "../types";
import { Button } from "./Button";
import { AuthButton } from "./AuthButton";

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

  const handleConnect = () => {
    connect({ connector: connectors[0] });
  };

  const methods = useForm<Pick<User, "email" | "name">>({
    defaultValues: user,
    shouldUnregister: true,
  });
  const { reset } = methods;

  useEffect(() => {
    reset(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const [editing, setEditing] = useState(false);

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
                <Form methods={methods}>
                  <Card.Header>
                    <Row justify="flex-end">
                      <div style={{ display: "flex", gap: 16 }}>
                        {editing ? (
                          <Button
                            size="xs"
                            color="success"
                            bordered
                            onClick={() => {
                              setEditing(false);
                            }}
                          >
                            Save
                          </Button>
                        ) : (
                          <Button
                            size="xs"
                            color="primary"
                            bordered
                            onClick={() => {
                              setEditing(true);
                            }}
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
                            }}
                          >
                            Cancel
                          </Button>
                        ) : (
                          <Button
                            size="xs"
                            color="error"
                            bordered
                            onClick={() => {
                              user.logOut();
                            }}
                          >
                            Log out
                          </Button>
                        )}
                      </div>
                    </Row>
                  </Card.Header>

                  <Card.Divider />

                  <Card.Body>
                    <div style={{ display: "grid", gap: 40, marginTop: 16 }}>
                      <FormInput
                        labelPlaceholder="Email"
                        name="email"
                        required
                        readOnly={!editing}
                        clearable={editing}
                        bordered={editing}
                      />
                      <FormInput
                        labelPlaceholder="Name"
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

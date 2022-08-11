import React, { useState } from "react";
import {
  Button,
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

export const ConnectButton = () => {
  const account = useAccount();
  const [infoVisible, setInfoVisible] = useState(false);
  const { connect, connectors, ...connection } = useConnect({
    onSuccess: () => {
      setInfoVisible(true);
    },
  });
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    connect({ connector: connectors[0] });
  };

  return (
    <>
      {account.isConnected && account.address ? (
        <Button
          flat
          auto
          rounded
          bordered
          onClick={() => setInfoVisible(true)}
          css={{ position: "relative" }}
        >
          <div style={{ paddingRight: 20 }}>
            <EnsName />
          </div>

          <div style={{ position: "absolute", right: 10 }}>
            <EnsAvatar size="xs" css={{ cursor: "pointer" }} />
          </div>
        </Button>
      ) : (
        <Button flat auto rounded bordered onClick={handleConnect}>
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
          onClose={() => setInfoVisible(false)}
        >
          <Modal.Header css={{ position: "absolute", top: 0 }}>
            <Text size={16} transform="uppercase">
              Account
            </Text>
          </Modal.Header>

          <Modal.Body css={{ mb: "$sm", mt: "$lg" }}>
            <Card variant="bordered">
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
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

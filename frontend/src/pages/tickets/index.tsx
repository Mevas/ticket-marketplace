import React from "react";
import { useTickets } from "../../hooks/use-tickets";
import { Ticket } from "../../components/Ticket";

export const Tickets = () => {
  const tickets = useTickets();

  return (
    <div
      style={{
        display: "grid",
        gap: 32,
        gridTemplateColumns: "repeat(5, 1fr)",
      }}
    >
      {tickets?.map((ticket, index) => (
        <Ticket ticket={ticket} key={index} />
      ))}
    </div>
  );
};

export default Tickets;

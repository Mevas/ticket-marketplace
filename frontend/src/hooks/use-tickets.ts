import { useQuery } from "react-query";
import { axiosInstance } from "../utils/auth";
import { AxiosError } from "axios";
import { Ticket } from "../types";

export const useTickets = () => {
  const { data: tickets } = useQuery<unknown, AxiosError, Array<Ticket>>(
    ["tickets/mine"],
    async () => (await axiosInstance.get("tickets/mine")).data
  );

  return tickets;
};

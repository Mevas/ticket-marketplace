import { useQuery } from "react-query";
import { axiosInstance } from "../utils/auth";
import { AxiosError } from "axios";

export const useTickets = () => {
  const { data: tickets } = useQuery<
    unknown,
    AxiosError,
    Array<{ id: number; art?: string; number: number; tier: string }>
  >(
    ["tickets/mine"],
    async () => (await axiosInstance.get("tickets/mine")).data
  );

  return tickets;
};

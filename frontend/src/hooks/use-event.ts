import { useQuery } from "react-query";
import { axiosInstance } from "../utils/auth";
import { AdminEvent } from "../types";
import { UseQueryOptions } from "react-query/lib/reactjs/types";

export const useEvent = (
  id?: number,
  options?: Omit<UseQueryOptions<AdminEvent>, "queryKey" | "queryFn">
) => {
  const { data, ...query } = useQuery<AdminEvent>(
    [`events/${id}`],
    async () => {
      return (await axiosInstance.get(`events/${id}`)).data;
    },
    {
      enabled: typeof id !== "undefined",
      ...options,
    }
  );

  return {
    event: data,
    ...query,
  };
};

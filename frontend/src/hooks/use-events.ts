import { useQuery } from "react-query";
import { Event } from "../types";
import { getEvents } from "../utils/api";

export const useEvents = () => {
  return useQuery<Event[]>(["events"], getEvents);
};

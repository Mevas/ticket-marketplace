import { useEvents } from "./use-events";

export const useEvent = (id?: number) => {
  const { data: events } = useEvents();
  return events?.find((event) => event.id === id);
};

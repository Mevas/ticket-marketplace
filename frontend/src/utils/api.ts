import { axiosInstance } from "./auth";

export const getEvents = async () => {
  return (await axiosInstance.get("events")).data;
};

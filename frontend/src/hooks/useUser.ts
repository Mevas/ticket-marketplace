import { useQuery, useQueryClient } from "react-query";
import { AxiosError } from "axios";
import { useSigner } from "wagmi";
import {
  axiosInstance,
  deleteAuthToken,
  getAuthToken,
  setAuthToken,
} from "../utils/auth";
import * as Web3Token from "web3-token";
import { useUpdate } from "react-use";
import { User } from "../types";

export const useUser = () => {
  const { data: signer } = useSigner();
  const rerender = useUpdate();

  const isLoggedIn = !!getAuthToken();
  const queryClient = useQueryClient();

  const meQuery = useQuery<User, AxiosError>(
    ["me"],
    async () => {
      return (await axiosInstance.get("users/me")).data;
    },
    {
      enabled: isLoggedIn,
      onError: () => {
        queryClient.removeQueries(["me"]);
      },
    }
  );

  const logIn = async () => {
    if (!signer) {
      return;
    }

    let token = getAuthToken();

    if (!token) {
      token = await Web3Token.sign(
        async (msg) => await signer.signMessage(msg),
        "1d"
      );
    }

    setAuthToken(token);

    const response = await meQuery.refetch();

    rerender();

    return response;
  };

  const logOut = async () => {
    deleteAuthToken();
    rerender();
  };

  return { logIn, logOut, isLoggedIn, ...meQuery.data };
};

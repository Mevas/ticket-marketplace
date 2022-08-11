import { useQuery, useQueryClient } from "react-query";
import { AxiosError } from "axios";
import { useSigner } from "wagmi";
import { axiosInstance } from "../utils/auth";
import * as Web3Token from "web3-token";
import { useLocalStorage } from "react-use";
import { User } from "../types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { isLoggedInAtom } from "../recoil/atoms/is-logged-in";

export const useUser = () => {
  const { data: signer } = useSigner();
  const [token, setToken, removeToken] = useLocalStorage<string>(
    "auth-token",
    undefined,
    { raw: true }
  );
  const queryClient = useQueryClient();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const meQuery = useQuery<User, AxiosError>(
    ["me"],
    async () => {
      return (await axiosInstance.get("users/me")).data;
    },
    {
      enabled: !!token,
      onError: () => {
        queryClient.removeQueries(["me"]);
      },
    }
  );

  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInAtom);

  useEffect(() => {
    setIsLoggedIn(!!meQuery.data?.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meQuery.data?.email]);

  const logIn = useCallback(async () => {
    if (!signer) {
      return;
    }

    if (!token) {
      setIsLoggingIn(true);
      try {
        setToken(
          await Web3Token.sign(
            async (msg) => await signer.signMessage(msg),
            "1d"
          )
        );
      } catch (e) {
        if (e instanceof Error) {
          console.error(e);
          setIsLoggingIn(false);
        }
      }
    }

    const response = await meQuery.refetch();

    setIsLoggingIn(false);

    return response;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setToken, signer, token]);

  const logOut = useCallback(() => {
    queryClient.removeQueries(["me"]);
    removeToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useMemo(
    () => ({
      logIn,
      logOut,
      isLoggedIn,
      isLoggingIn,
      ...meQuery.data,
    }),
    [isLoggedIn, isLoggingIn, logIn, logOut, meQuery.data]
  );
};

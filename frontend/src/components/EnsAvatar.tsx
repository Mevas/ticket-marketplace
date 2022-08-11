import React from "react";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import { Avatar, AvatarProps } from "@nextui-org/react";

export const EnsAvatar = (props: AvatarProps) => {
  const account = useAccount();
  const { data: ensName } = useEnsName({ address: account?.address });
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: account?.address });

  return (
    <>
      <Avatar
        {...props}
        text={ensName ?? props.text}
        src={
          ensAvatar ??
          props.src ??
          "https://wallpaperaccess.com/full/1550579.jpg"
        }
      />
    </>
  );
};

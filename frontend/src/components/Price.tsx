import React from "react";
import EthereumIcon from "../../public/assets/svgs/icons/eth.svg";
import { Text, useTheme } from "@nextui-org/react";
import { isFirefox } from "react-device-detect";

export type PriceProps = {
  price: number | string;
  currency?: "ETH" | "USD";
};

export const Price = ({ price, currency = "ETH" }: PriceProps) => {
  const { isDark } = useTheme();
  console.log(isDark);
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {currency === "ETH" ? (
        <EthereumIcon
          style={{
            width: 12,
            fill: !isFirefox ? "white" : isDark ? "white" : "black",
            marginRight: 4,
          }}
        />
      ) : (
        <Text
          style={{ paddingRight: 2 }}
          size={20}
          color={!isFirefox ? "white" : undefined}
        >
          $
        </Text>
      )}
      <Text size={20} color={!isFirefox ? "white" : undefined}>
        {price ?? 0.5}
      </Text>
    </div>
  );
};

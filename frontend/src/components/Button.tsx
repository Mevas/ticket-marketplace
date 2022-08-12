import React from "react";
import {
  Button as NextButton,
  ButtonProps as NextButtonProps,
  Loading,
} from "@nextui-org/react";

export type ButtonProps = NextButtonProps & {
  loading?: boolean | string;
};

export const Button = ({
  loading,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <NextButton {...props} disabled={disabled || !!loading}>
      {loading ? (
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Loading type="spinner" color="currentColor" />
          {typeof loading === "string" && loading}
        </div>
      ) : (
        children
      )}
    </NextButton>
  );
};

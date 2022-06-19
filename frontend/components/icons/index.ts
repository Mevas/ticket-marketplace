import { CSS } from "@nextui-org/react";

export interface IconProps {
  fill?: string;
  filled?: boolean;
  size?: string | number;
  height?: string | number;
  width?: string | number;
  label?: string;
  onClick?: () => void;
  className?: string;
  css?: CSS;
}

export * from "./Sun";
export * from "./Moon";

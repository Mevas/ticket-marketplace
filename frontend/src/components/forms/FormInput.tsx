import { Controller, useFormContext } from "react-hook-form";
import React from "react";
import { Input, InputProps } from "@nextui-org/react";
import { SharedFieldProps } from "./types";

export type FormInputProps = SharedFieldProps & Partial<InputProps>;

/**
 * RHF-controlled input for use inside of forms.
 *
 * Must be wrapped with a {@link Form} component!
 */
export const FormInput = ({ name, ...props }: FormInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={(controllerProps) => (
        <Input
          clearable
          bordered
          fullWidth
          color="primary"
          size="lg"
          {...props}
          {...controllerProps.field}
        />
      )}
    />
  );
};

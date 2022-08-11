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
  const { control, getValues, formState } = useFormContext();

  const isErrored = !!formState.errors[name];

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
          status={isErrored ? "error" : undefined}
          size="lg"
          {...props}
          {...controllerProps.field}
          // getValues is needed as a hack to circumvent the controller not updating correctly for some reason
          value={controllerProps.field.value ?? getValues(name)}
        />
      )}
    />
  );
};

import { FormProvider } from "react-hook-form";
import { FormProviderProps } from "react-hook-form/dist/types";
import React from "react";

// This `any` is taken from the library definition
export type FormProps<TFieldValues extends Record<string, any>> =
  React.PropsWithChildren<
    {
      onSubmit?: JSX.IntrinsicElements["form"]["onSubmit"];
      methods: Omit<FormProviderProps<TFieldValues>, "children">;
    } & Omit<JSX.IntrinsicElements["form"], "onSubmit">
  >;

/**
 * Wrapper for forms. Creates an RHF provider to pass things like control to all nested fields, to avoid having to call `register` on each one.
 */
// This `any` is taken from the library definition
export const Form = <TFieldValues extends Record<string, any>>({
  children,
  methods,
  onSubmit,
}: FormProps<TFieldValues>) => {
  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit ?? (() => {})}>{children}</form>
    </FormProvider>
  );
};

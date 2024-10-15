import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  Input,
  InputField,
} from "@gluestack-ui/themed";
import React, { ComponentProps } from "react";
import {
  FieldPath,
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";

interface FormInputProps<T extends FieldValues>
  extends UseControllerProps<T, FieldPath<T>> {
  inputMode?: ComponentProps<typeof InputField>["inputMode"];
  placeholder?: string;
}

export const FormInput = <T extends FieldValues>({
  placeholder,
  inputMode,
  ...controllerProps
}: FormInputProps<T>) => {
  const { field, fieldState } = useController(controllerProps);

  return (
    <FormControl isInvalid={!!fieldState.error} size="lg">
      <Input variant="underlined">
        <InputField
          inputMode={inputMode}
          onBlur={field.onBlur}
          onChangeText={field.onChange}
          placeholder={placeholder}
          value={field.value?.toString()}
        />
      </Input>
      <FormControlError>
        <FormControlErrorText>{fieldState.error?.message}</FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
};

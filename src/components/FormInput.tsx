import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  Input,
  InputField,
} from "@gluestack-ui/themed";
import React from "react";
import {
  FieldPath,
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";

interface FormInputProps<T extends FieldValues>
  extends UseControllerProps<T, FieldPath<T>> {
  placeholder?: string;
}

export const FormInput = <T extends FieldValues>({
  placeholder,
  ...controllerProps
}: FormInputProps<T>) => {
  const { field, fieldState } = useController(controllerProps);

  return (
    <FormControl isInvalid={!!fieldState.error} size="lg">
      <Input variant="underlined">
        <InputField
          onBlur={field.onBlur}
          onChangeText={field.onChange}
          placeholder={placeholder}
        />
      </Input>
      <FormControlError>
        <FormControlErrorText>{fieldState.error?.message}</FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
};

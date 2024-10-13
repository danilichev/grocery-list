import { AddIcon, Box, Icon, Spinner } from "@gluestack-ui/themed";
import React, { ComponentProps } from "react";
import { TouchableOpacity } from "react-native";

interface AddButtonProps {
  bg?: ComponentProps<typeof Box>["bg"];
  isDisabled?: boolean;
  isLoading?: boolean;
  onPress: () => void;
}

export const AddButton = ({
  bg = "$primary800",
  isDisabled,
  isLoading,
  onPress,
}: AddButtonProps) => (
  <TouchableOpacity activeOpacity={0.8} disabled={isDisabled} onPress={onPress}>
    <Box
      opacity={isLoading ? 0.8 : 1}
      alignItems="center"
      bg={bg}
      borderRadius="$full"
      bottom="$6"
      h="$16"
      justifyContent="center"
      position="absolute"
      right="$6"
      w="$16"
    >
      {isLoading ? (
        <Spinner color="white" />
      ) : (
        <Icon as={AddIcon} color="white" w="$8" h="$8" />
      )}
    </Box>
  </TouchableOpacity>
);

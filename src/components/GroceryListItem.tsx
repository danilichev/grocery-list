import {
  Box,
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckIcon,
  HStack,
  Icon,
  Text,
  TrashIcon,
} from "@gluestack-ui/themed";
import React, { useCallback } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";

import { GroceryItem } from "src/types/domain";

interface GroceryItemProps extends GroceryItem {
  onCheck: (item: GroceryItem, isChecked: boolean) => void;
  onDelete: (item: GroceryItem) => void;
  onEdit: (item: GroceryItem) => void;
}

export const GroceryListItem = ({
  onCheck,
  onDelete,
  onEdit,
  ...item
}: GroceryItemProps) => {
  const onCheckItemChange = useCallback(
    (isChecked: boolean) => {
      onCheck(item, isChecked);
    },
    [item, onCheck],
  );

  const onDeleteItemPress = useCallback(() => {
    onDelete(item);
  }, [item, onDelete]);

  const onEditItemPress = useCallback(() => {
    onEdit(item);
  }, [item, onEdit]);

  const renderRightActions = useCallback(
    (progress: Animated.AnimatedInterpolation<number>) => {
      const translateX = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [80, 0],
      });

      return (
        <View style={styles.rightActionsContainer}>
          <Animated.View
            style={{
              alignItems: "center",
              justifyContent: "center",
              transform: [{ translateX }],
            }}
          >
            <TouchableOpacity activeOpacity={0.8} onPress={onDeleteItemPress}>
              <Icon as={TrashIcon} color="$rose600" p="$1" w="$5" h="$5" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      );
    },
    [onDeleteItemPress],
  );

  return (
    <Swipeable renderRightActions={renderRightActions} rightThreshold={8}>
      <Box borderBottomWidth="$1" borderColor="$trueGray300" py="$4" p="$8">
        <HStack>
          <Checkbox
            isChecked={item.isChecked}
            mr="$2"
            onChange={onCheckItemChange}
            size="md"
            value=""
          >
            <CheckboxIndicator mr="$2" bgColor="transparent">
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
          </Checkbox>
          <TouchableOpacity activeOpacity={0.8} onPress={onEditItemPress}>
            <Text
              color="$coolGray800"
              fontWeight="$bold"
              textDecorationLine={item.isChecked ? "line-through" : "none"}
            >
              {[item.name, [item.quantity, item.unit].join(" ")].join(", ")}
            </Text>
          </TouchableOpacity>
        </HStack>
      </Box>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  rightActionsContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 64,
  },
});

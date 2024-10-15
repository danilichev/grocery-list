import {
  Box,
  Button,
  ButtonText,
  HStack,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, FlatList, ListRenderItemInfo } from "react-native";
import * as yup from "yup";

import * as api from "src/api/groceryLists";
import { AddButton } from "src/components/AddButton";
import { FormInput } from "src/components/FormInput";
import { GroceryListItem } from "src/components/GroceryListItem";
import { QueryKeys } from "src/services/queryClient";
import { GroceryItem, GroceryList } from "src/types/domain";
import { RootParamList } from "src/types/navigation";
import { keyExtractor } from "src/utils/common";

type FormData = Pick<GroceryItem, "name" | "quantity" | "unit">;

const defaultValues: FormData = {
  name: "",
};

const schema = yup.object<FormData>().shape({
  name: yup
    .string()
    .min(3, "Must contain at least 3 characters")
    .required("Required field"),
  quantity: yup.number().positive(),
  unit: yup.string(),
});

export default function GroceryListScreen() {
  const searchParams = useLocalSearchParams<RootParamList["grocery-list"]>();
  const queryClient = useQueryClient();

  const groceryListQueryKey = useMemo(
    () => [QueryKeys.groceryList, searchParams.id],
    [searchParams.id],
  );

  const { data: groceryList, isFetching: isGroceryListFetching } = useQuery({
    enabled: !!searchParams.id,
    queryFn: ({ queryKey: [, id] }) => api.getGroceryList({ id }),
    queryKey: groceryListQueryKey,
  });

  const { mutateAsync: updateGroceryList } = useMutation({
    mutationFn: api.updateGroceryList,
    onError: (
      error,
      _,
      context: { prevGroceryList?: GroceryList } | undefined,
    ) => {
      Alert.alert("Error", "Failed to update grocery list");
      queryClient.setQueryData(groceryListQueryKey, context?.prevGroceryList);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: groceryListQueryKey });

      const prevGroceryList =
        queryClient.getQueryData<GroceryList>(groceryListQueryKey);

      queryClient.setQueryData(groceryListQueryKey, (old: GroceryList) => ({
        ...old,
        ...variables.update,
      }));

      return { prevGroceryList };
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: groceryListQueryKey,
      });
    },
    onSuccess: async () => {
      return await queryClient.invalidateQueries({
        queryKey: [QueryKeys.groceryLists],
      });
    },
  });

  const { control, handleSubmit, reset, watch } = useForm<FormData>({
    defaultValues,
    resolver: yupResolver<FormData>(schema),
  });

  const [selectedItemId, setSelectedItemId] = useState<string>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onCloseModalPress = useCallback(() => {
    reset(defaultValues);
    setSelectedItemId(undefined);
    setIsModalOpen(false);
  }, [reset]);

  const onAddItemPress = useCallback(() => {
    reset(defaultValues);
    setSelectedItemId(undefined);
    setIsModalOpen(true);
  }, [reset]);

  const onCheckItemChange = useCallback(
    (item: GroceryItem, isChecked: boolean) => {
      updateGroceryList({
        id: searchParams.id,
        update: {
          items: groceryList?.items.map((i) =>
            i.id === item.id ? { ...i, isChecked } : i,
          ),
        },
      });
    },
    [groceryList?.items, searchParams.id, updateGroceryList],
  );

  const onDeleteItemPress = useCallback(
    (item: GroceryItem) => {
      updateGroceryList({
        id: searchParams.id,
        update: {
          items: groceryList?.items.filter((i) => i.id !== item.id),
        },
      });
    },
    [groceryList?.items, searchParams.id, updateGroceryList],
  );

  const onEditItemPress = useCallback(
    (item: GroceryItem) => {
      setSelectedItemId(item.id);
      reset(item);
      setIsModalOpen(true);
    },
    [reset],
  );

  const onUpdateItemSubmit = useCallback(
    (data: FormData) => {
      const currentItems = groceryList?.items || [];
      const updatedItems = selectedItemId
        ? currentItems.map((item) =>
            item.id === selectedItemId ? { ...item, ...data } : item,
          )
        : [
            ...currentItems,
            { ...data, id: `${currentItems.length + 1}`, isChecked: false },
          ];

      updateGroceryList({
        id: searchParams.id,
        update: { items: updatedItems },
      });

      setIsModalOpen(false);
    },
    [groceryList?.items, searchParams.id, selectedItemId, updateGroceryList],
  );

  const renderGroceryItem = useCallback(
    ({ item }: ListRenderItemInfo<GroceryItem>) => {
      return (
        <GroceryListItem
          {...item}
          onCheck={onCheckItemChange}
          onDelete={onDeleteItemPress}
          onEdit={onEditItemPress}
        />
      );
    },
    [onCheckItemChange, onDeleteItemPress, onEditItemPress],
  );

  const formValues = watch();

  useEffect(() => {
    console.log("formValues", formValues);
  }, [formValues]);

  return (
    <>
      <FlatList
        ListEmptyComponent={
          isGroceryListFetching ? null : (
            <Box alignItems="center" p="$8">
              <Text color="$coolGray800" fontSize="$md" fontWeight="$bold">
                No items yet
              </Text>
            </Box>
          )
        }
        data={groceryList?.items}
        keyExtractor={keyExtractor}
        renderItem={renderGroceryItem}
      />
      <AddButton bg="$primary700" onPress={onAddItemPress} />
      <Modal isOpen={isModalOpen} onClose={onCloseModalPress}>
        <ModalBackdrop />
        <ModalContent paddingVertical="$2" paddingHorizontal="$2">
          <ModalHeader />
          <ModalBody automaticallyAdjustKeyboardInsets>
            <VStack>
              <FormInput<FormData>
                control={control}
                name="name"
                placeholder="Item Name"
              />
              <HStack space="md">
                <Box flex={1}>
                  <FormInput<FormData>
                    control={control}
                    inputMode="numeric"
                    name="quantity"
                    placeholder="Quantity"
                  />
                </Box>
                <Box flex={1}>
                  <FormInput<FormData>
                    control={control}
                    name="unit"
                    placeholder="Unit"
                  />
                </Box>
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent="flex-end" width="100%">
              <Button variant="link" onPress={onCloseModalPress}>
                <ButtonText fontSize="$lg" mr="$2" textDecorationLine="none">
                  Cancel
                </ButtonText>
              </Button>
              <Button variant="link" onPress={handleSubmit(onUpdateItemSubmit)}>
                <ButtonText fontSize="$lg" pl="$4" textDecorationLine="none">
                  OK
                </ButtonText>
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

import { Box, CheckIcon, HStack, Icon, Text } from "@gluestack-ui/themed";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import React, { useCallback, useMemo } from "react";
import {
  Alert,
  FlatList,
  ListRenderItemInfo,
  TouchableOpacity,
} from "react-native";

import { createGroceryList, getGroceryLists } from "src/api/groceryLists";
import { AddButton } from "src/components/AddButton";
import { ListFooter } from "src/components/ListFooter";
import { useLoadMore } from "src/hooks/useLoadMore";
import { QueryKeys } from "src/services/queryClient";
import { GroceryList } from "src/types/domain";
import { RootNavigationProp } from "src/types/navigation";
import { keyExtractor } from "src/utils/common";

const ITEMS_PER_REQUEST = 20;

const isListCompleted = (list: GroceryList) =>
  list.items.length > 0 && list.items.every((item) => item.isChecked);

export default function HomeScreen() {
  const navigation = useNavigation<RootNavigationProp>();

  const { data, fetchNextPage, hasNextPage, isFetching, refetch } =
    useInfiniteQuery({
      queryFn: ({ pageParam }) => getGroceryLists(pageParam),
      queryKey: [QueryKeys.groceryLists],
      initialPageParam: { limit: ITEMS_PER_REQUEST, offset: 0 },
      getNextPageParam: (lastPage) => {
        const loadedDataSize = lastPage.data.length + (lastPage.offset || 0);
        return loadedDataSize < lastPage.total
          ? { limit: ITEMS_PER_REQUEST, offset: loadedDataSize }
          : null;
      },
    });

  const { mutateAsync: addGroceryList, isPending: isGroceryListAdding } =
    useMutation({
      mutationFn: createGroceryList,
      mutationKey: [QueryKeys.createGroceryList],
      onError: (error) => {
        Alert.alert("Error", "Failed to add grocery list");
      },
      onSuccess: (data) => {
        navigation.navigate("grocery-list", { id: data.id, name: data.name });
        refetch();
      },
    });

  const loadMore = useLoadMore({ fetchNextPage, hasNextPage, isFetching });

  const groceryLists = useMemo(
    () => data?.pages.flatMap((page) => page.data),
    [data],
  );

  const completedListMap = useMemo(
    () =>
      (groceryLists || []).reduce(
        (acc, val) => ({ ...acc, [val.id]: isListCompleted(val) }),
        {} as Record<string, boolean>,
      ),
    [groceryLists],
  );

  const onAddItemPress = useCallback(() => {
    const number = (data?.pages[data.pages.length - 1].total || 0) + 1;

    addGroceryList({
      id: `${number}`,
      items: [],
      name: `List ${number}`,
      number,
    });
  }, [addGroceryList, data]);

  const onItemPress = useCallback(
    ({ id, name }: GroceryList) =>
      () => {
        navigation.navigate("grocery-list", { id, name });
      },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<GroceryList>) => (
      <TouchableOpacity activeOpacity={0.8} onPress={onItemPress(item)}>
        <Box borderBottomWidth="$1" borderColor="$trueGray300" py="$4" p="$8">
          <HStack space="md" justifyContent="space-between">
            <Text color="$coolGray800" fontWeight="$bold">
              {item.name}
            </Text>
            {completedListMap[item.id] ? (
              <Icon as={CheckIcon} color="primary600" w="$5" h="$5" />
            ) : null}
          </HStack>
        </Box>
      </TouchableOpacity>
    ),
    [completedListMap, onItemPress],
  );

  return (
    <>
      <FlatList
        ListEmptyComponent={
          isFetching ? null : (
            <Box alignItems="center" p="$8">
              <Text color="$coolGray800" fontSize="$md" fontWeight="$bold">
                No saved lists yet
              </Text>
            </Box>
          )
        }
        ListFooterComponent={<ListFooter isLoading={isFetching} />}
        data={groceryLists}
        keyExtractor={keyExtractor}
        onEndReached={loadMore}
        onEndReachedThreshold={0.25}
        renderItem={renderItem}
      />
      <AddButton isLoading={isGroceryListAdding} onPress={onAddItemPress} />
    </>
  );
}

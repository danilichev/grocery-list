import {
  Box,
  CheckIcon,
  HStack,
  Icon,
  Spinner,
  Text,
} from "@gluestack-ui/themed";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import React, { useCallback, useMemo } from "react";
import {
  Button,
  FlatList,
  ListRenderItemInfo,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";

import { getGroceryLists } from "src/api/groceryLists";
import { useLoadMore } from "src/hooks/useLoadMore";
import { QueryKeys } from "src/services/queryClient";
import { GroceryList } from "src/types/domain";
import { RootNavigationProp } from "src/types/navigation";
import { keyExtractor } from "src/utils/common";

const ITEMS_PER_REQUEST = 20;

const isListCompleted = (list: GroceryList) =>
  list.items.length > 0 && list.items.every((item) => item.isChecked);

export default function SignInScreen() {
  const navigation = useNavigation<RootNavigationProp>();

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryFn: ({ pageParam }) => getGroceryLists(pageParam),
    queryKey: [QueryKeys.groceryLists],
    initialPageParam: { limit: ITEMS_PER_REQUEST, offset: 0 },
    getNextPageParam: (lastPage) => {
      const loadedDataSize = lastPage.data.length + (lastPage.offset || 0);
      return loadedDataSize < lastPage.total
        ? { limit: ITEMS_PER_REQUEST, offset: loadedDataSize }
        : null;
    },
    select: (data) => data.pages.flatMap((page) => page.data),
  });

  const loadMore = useLoadMore({ fetchNextPage, hasNextPage, isFetching });

  const completedListMap = useMemo(
    () =>
      (data || []).reduce(
        (acc, val) => ({ ...acc, [val.id]: isListCompleted(val) }),
        {} as Record<string, boolean>,
      ),
    [data],
  );

  const onPressItem = useCallback(
    (id: string) => () => {
      navigation.navigate("grocery-list", { id });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<GroceryList>) => (
      <TouchableOpacity activeOpacity={0.8} onPress={onPressItem(item.id)}>
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
    [completedListMap, onPressItem],
  );

  return (
    <View>
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
        ListFooterComponent={isFetching ? <Spinner m="$4" /> : null}
        data={data}
        keyExtractor={keyExtractor}
        onEndReached={loadMore}
        onEndReachedThreshold={0.25}
        renderItem={renderItem}
      />
    </View>
  );
}

import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

import { getGroceryLists } from "src/api/groceryLists";
import { QueryKeys } from "src/services/queryClient";
import { RootNavigationProp } from "src/types/navigation";

const ITEMS_PER_REQUEST = 20;

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

  console.log("data", data);

  // useEffect(() => {
  //   getGroceryLists({ limit: ITEMS_PER_REQUEST, offset: 120 }).then((res) => {
  //     console.log("getGroceryLists", res);
  //   });
  // }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>My Grocery Lists</Text>
      <Button
        title="Open Some Grocery List"
        onPress={() => {
          navigation.navigate("grocery-list");
        }}
      />
    </View>
  );
}

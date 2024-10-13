import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";

import { getGroceryList } from "src/api/groceryLists";
import { QueryKeys } from "src/services/queryClient";
import { RootNavigationProp, RootParamList } from "src/types/navigation";

export default function GroceryList() {
  const searchParams = useLocalSearchParams<RootParamList["grocery-list"]>();

  const {
    data: groceryList,
    error: groceryListError,
    isPending: isGroceryListPending,
  } = useQuery({
    enabled: !!searchParams.id,
    queryFn: ({ queryKey: [, id] }) => getGroceryList({ id }),
    queryKey: [QueryKeys.groceryList, searchParams.id],
  });

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Some Grocery List</Text>
    </View>
  );
}

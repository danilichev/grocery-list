import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Text, View } from "react-native";

import { getGroceryList } from "src/api/groceryLists";
import { QueryKeys } from "src/services/queryClient";

export default function GroceryList() {
  const [groceryListId] = useState("1");

  const {
    data: groceryList,
    error: groceryListError,
    isPending: isGroceryListPending,
  } = useQuery({
    enabled: !!groceryListId,
    queryFn: ({ queryKey: [, id] }) => getGroceryList({ id: id }),
    queryKey: [QueryKeys.groceryList, groceryListId],
  });

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Some Grocery List</Text>
    </View>
  );
}

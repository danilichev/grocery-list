import { useNavigation } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

import { RootNavigationProp } from "src/types/navigation";

export default function SignInScreen() {
  const navigation = useNavigation<RootNavigationProp>();

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

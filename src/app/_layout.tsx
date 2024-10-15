import { config } from "@gluestack-ui/config";
import {
  Box,
  ChevronLeftIcon,
  GluestackUIProvider,
  Icon,
} from "@gluestack-ui/themed";
import { Stack, useNavigation } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { QueryClientProvider } from "src/services/queryClient";
import { RootParamList } from "src/types/navigation";

export default function RootLayout() {
  const navigation = useNavigation();

  return (
    <GestureHandlerRootView style={styles.root}>
      <GluestackUIProvider config={config}>
        <QueryClientProvider>
          <Stack
            screenOptions={{
              headerBackTitleVisible: false,
              headerBackVisible: false,
              headerLeft: ({ canGoBack }) =>
                canGoBack ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    hitSlop={{ top: 8, bottom: 8, left: 16, right: 16 }}
                    onPress={navigation.goBack}
                  >
                    <Box ml={-10}>
                      <Icon as={ChevronLeftIcon} w="$7" h="$7" />
                    </Box>
                  </TouchableOpacity>
                ) : null,
            }}
          >
            <Stack.Screen
              name="index"
              options={{ title: "My Grocery Lists" }}
            />
            <Stack.Screen
              name="grocery-list"
              options={(options) => ({
                title: (options.route.params as RootParamList["grocery-list"])
                  .name,
              })}
            />
          </Stack>
        </QueryClientProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

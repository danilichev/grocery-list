import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { Stack } from "expo-router";
import React from "react";

import { QueryClientProvider } from "src/services/queryClient";

export default function RootLayout() {
  return (
    <GluestackUIProvider config={config}>
      <QueryClientProvider>
        <Stack
          screenOptions={{
            headerBackTitleVisible: false,
          }}
        >
          <Stack.Screen name="index" options={{ title: "My Grocery Lists" }} />
          <Stack.Screen
            name="grocery-list"
            options={{ title: "Grocery List" }}
          />
        </Stack>
      </QueryClientProvider>
    </GluestackUIProvider>
  );
}

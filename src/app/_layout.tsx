import { Slot } from "expo-router";
import React from "react";

import { QueryClientProvider } from "src/services/queryClient";

export default function RootLayout() {
  return (
    <QueryClientProvider>
      <Slot />
    </QueryClientProvider>
  );
}

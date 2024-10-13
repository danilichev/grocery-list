import { Spinner } from "@gluestack-ui/themed";
import React from "react";

interface ListFooterProps {
  isLoading?: boolean;
}

export const ListFooter = ({ isLoading }: ListFooterProps) => {
  return isLoading ? <Spinner m="$4" /> : null;
};

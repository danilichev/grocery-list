import { NavigationProp } from "@react-navigation/native";

export interface RootParamList {
  "grocery-list": { id: string };
  index: undefined;
}

export type RootNavigationProp = NavigationProp<RootParamList>;

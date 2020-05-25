import "react-native-gesture-handler";
import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

declare const global: { HermesInternal: null | {} };

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView></SafeAreaView>
    </NavigationContainer>
  );
};

export default App;

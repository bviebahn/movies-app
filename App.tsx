import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { StatusBar, Platform, UIManager } from "react-native";

import {
    black,
    gray1,
    gray2,
    primaryColor,
    textColor,
} from "./constants/colors";
import TabNavigator from "./navigators/TabNavigator";
import { UserProvider } from "./tmdb/useUser";
import { FeedbackProvider } from "./util/useFeedback";
import { AccountListSelectorProvider } from "./util/useAccountListSelector";
import { SafeAreaProvider } from "react-native-safe-area-context";

declare const global: { HermesInternal: null | {} };

if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const App = () => {
    return (
        <>
            <StatusBar barStyle="light-content" />
            <NavigationContainer
                theme={{
                    dark: true,
                    colors: {
                        background: gray1,
                        primary: primaryColor,
                        card: gray2,
                        text: textColor,
                        border: black,
                    },
                }}>
                <SafeAreaProvider>
                    <FeedbackProvider>
                        <UserProvider>
                            <AccountListSelectorProvider>
                                <TabNavigator />
                            </AccountListSelectorProvider>
                        </UserProvider>
                    </FeedbackProvider>
                </SafeAreaProvider>
            </NavigationContainer>
        </>
    );
};

export default App;

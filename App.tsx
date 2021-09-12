import { NavigationContainer } from "@react-navigation/native";
import React, { useState } from "react";
import { Platform, StatusBar, UIManager } from "react-native";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "react-query";
import {
    black,
    gray1,
    gray2,
    primaryColor,
    textColor,
} from "./constants/colors";
import TabNavigator from "./navigators/TabNavigator";
import { UserProvider } from "./tmdb/useUser";
import { AccountListSelectorProvider } from "./util/useAccountListSelector";
import { FeedbackProvider } from "./util/useFeedback";

declare const global: { HermesInternal: null | {} };

if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const App = () => {
    const [queryClient] = useState(() => new QueryClient());
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
                    <QueryClientProvider client={queryClient}>
                        <FeedbackProvider>
                            <UserProvider>
                                <AccountListSelectorProvider>
                                    <TabNavigator />
                                </AccountListSelectorProvider>
                            </UserProvider>
                        </FeedbackProvider>
                    </QueryClientProvider>
                </SafeAreaProvider>
            </NavigationContainer>
        </>
    );
};

export default App;

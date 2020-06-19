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

declare const global: { HermesInternal: null | {} };

if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

type ComposeProps = {
    components: Array<
        React.JSXElementConstructor<React.PropsWithChildren<any>>
    >;
    children: React.ReactNode;
};

function Compose(props: ComposeProps) {
    const { components, children } = props;

    return (
        <>
            {components.reduceRight(
                (acc, Comp) => (
                    <Comp>{acc}</Comp>
                ),
                children,
            )}
        </>
    );
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
                <TabNavigator />
            </NavigationContainer>
        </>
    );
};

const ComposedApp = () => (
    <Compose components={[UserProvider, FeedbackProvider]}>
        <App />
    </Compose>
);

export default ComposedApp;

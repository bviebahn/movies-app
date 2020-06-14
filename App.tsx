import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { StatusBar } from "react-native";

import {
    black,
    gray1,
    gray2,
    primaryColor,
    textColor,
} from "./constants/colors";
import TabNavigator from "./navigators/TabNavigator";
import { ConfigurationProvider } from "./tmdb/useConfiguration";
import { GenreProvider } from "./tmdb/useGenres";
import { MovieDetailsProvider } from "./tmdb/useMovieDetails";
import { SearchProvider } from "./tmdb/useSearch";
import { SeasonDetailsProvider } from "./tmdb/useSeasonDetails";
import { TvShowDetailsProvider } from "./tmdb/useTvShowDetails";
import { UserProvider } from "./tmdb/useUser";

declare const global: { HermesInternal: null | {} };

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
    <Compose
        components={[
            ConfigurationProvider,
            GenreProvider,
            UserProvider,
            MovieDetailsProvider,
            TvShowDetailsProvider,
            SeasonDetailsProvider,
            SearchProvider,
        ]}>
        <App />
    </Compose>
);

export default ComposedApp;

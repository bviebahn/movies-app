import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./navigators/TabNavigator";
import {
    gray1,
    primaryColor,
    gray2,
    textColor,
    black,
} from "./constants/colors";
import { GenreProvider } from "./tmdb/useGenres";
import { MovieDetailsProvider } from "./tmdb/useMovieDetails";
import { TvShowDetailsProvider } from "./tmdb/useTvShowDetails";
import { SeasonDetailsProvider } from "./tmdb/useSeasonDetails";

declare const global: { HermesInternal: null | {} };

const App = () => {
    return (
        <GenreProvider>
            <MovieDetailsProvider>
                <TvShowDetailsProvider>
                    <SeasonDetailsProvider>
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
                    </SeasonDetailsProvider>
                </TvShowDetailsProvider>
            </MovieDetailsProvider>
        </GenreProvider>
    );
};

export default App;

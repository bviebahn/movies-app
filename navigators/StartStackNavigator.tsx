import React from "react";
import {
    createStackNavigator,
    StackNavigationProp,
    TransitionPresets,
} from "@react-navigation/stack";
import { Movie, TvShow, Season } from "../tmdb/types";
import Home from "../screens/Home";
import MovieDetails from "../screens/MovieDetails";
import TvShowDetails from "../screens/TvShowDetails";
import { RouteProp } from "@react-navigation/native";
import CloseButton from "../components/CloseButton";
import { StyleSheet } from "react-native";
import SeasonDetails from "../screens/SeasonDetails";

type StartStackParams = {
    Home: undefined;
    MovieDetails: {
        movie: Movie;
    };
    TvShowDetails: {
        tvShow: TvShow;
    };
    SeasonDetails: {
        tvShowId: number;
        season: Season;
    };
};

const StartStack = createStackNavigator<StartStackParams>();

const StartStackNavigator: React.FC = () => {
    return (
        <StartStack.Navigator
            screenOptions={{
                headerTransparent: true,
                headerTitle: () => null,
                headerBackTitleVisible: false,
            }}>
            <StartStack.Screen name="Home" component={Home} />
            <StartStack.Screen
                name="MovieDetails"
                component={MovieDetails}
                options={({ navigation }) => ({
                    ...TransitionPresets.ModalTransition,
                    headerBackImage: () => null,
                    headerRight: () => (
                        <CloseButton
                            onPress={navigation.goBack}
                            style={styles.closeButton}
                        />
                    ),
                })}
            />
            <StartStack.Screen
                name="TvShowDetails"
                component={TvShowDetails}
                options={({ navigation }) => ({
                    ...TransitionPresets.ModalTransition,
                    headerBackImage: () => null,
                    headerRight: () => (
                        <CloseButton
                            onPress={navigation.goBack}
                            style={styles.closeButton}
                        />
                    ),
                })}
            />
            <StartStack.Screen
                name="SeasonDetails"
                component={SeasonDetails}
                options={({ navigation }) => ({
                    ...TransitionPresets.ModalTransition,
                    headerBackImage: () => null,
                    headerRight: () => (
                        <CloseButton
                            onPress={navigation.goBack}
                            style={styles.closeButton}
                        />
                    ),
                })}
            />
        </StartStack.Navigator>
    );
};

const styles = StyleSheet.create({ closeButton: { marginRight: 20 } });

export type StartStackNavigationProp<
    Screen extends keyof StartStackParams
> = StackNavigationProp<StartStackParams, Screen>;

export type StartStackRouteProp<
    Screen extends keyof StartStackParams
> = RouteProp<StartStackParams, Screen>;

export default StartStackNavigator;

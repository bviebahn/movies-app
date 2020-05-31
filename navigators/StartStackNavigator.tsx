import React from "react";
import {
    createStackNavigator,
    StackNavigationProp,
    TransitionPresets,
} from "@react-navigation/stack";
import { Movie } from "../tmdb/types";
import Home from "../screens/Home";
import MovieDetails from "../screens/MovieDetails";
import { RouteProp } from "@react-navigation/native";
import CloseButton from "../components/CloseButton";
import { StyleSheet } from "react-native";

type StartStackParams = {
    Home: undefined;
    MovieDetails: {
        movie: Movie;
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

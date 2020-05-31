import React from "react";
import {
    createStackNavigator,
    StackNavigationProp,
} from "@react-navigation/stack";
import { Movie } from "../tmdb/types";
import Home from "../screens/Home";
import MovieDetails from "../screens/MovieDetails";
import { RouteProp } from "@react-navigation/native";

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
            <StartStack.Screen name="MovieDetails" component={MovieDetails} />
        </StartStack.Navigator>
    );
};

export type StartStackNavigationProp<
    Screen extends keyof StartStackParams
> = StackNavigationProp<StartStackParams, Screen>;

export type StartStackRouteProp<
    Screen extends keyof StartStackParams
> = RouteProp<StartStackParams, Screen>;

export default StartStackNavigator;

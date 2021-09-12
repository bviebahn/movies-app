import { RouteProp } from "@react-navigation/native";
import {
    createNativeStackNavigator,
    NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import React from "react";
import Home from "../screens/Home";
import MovieDetails from "../screens/MovieDetails";
import PersonDetails from "../screens/PersonDetails";
import SeasonDetails from "../screens/SeasonDetails";
import TvShowDetails from "../screens/TvShowDetails";
import { Movie, Season, TvShow } from "../tmdb/types";
import { cardNavigationOptions } from "./navigationOptions";

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
    PersonDetails: {
        id: number;
    };
};

const StartStack = createNativeStackNavigator<StartStackParams>();

const StartStackNavigator: React.FC = () => {
    return (
        <StartStack.Navigator initialRouteName="Home">
            <StartStack.Screen name="Home" component={Home} />
            <StartStack.Screen
                name="MovieDetails"
                component={MovieDetails}
                options={cardNavigationOptions}
            />
            <StartStack.Screen
                name="TvShowDetails"
                component={TvShowDetails}
                options={cardNavigationOptions}
            />
            <StartStack.Screen
                name="SeasonDetails"
                component={SeasonDetails}
                options={cardNavigationOptions}
            />
            <StartStack.Screen
                name="PersonDetails"
                component={PersonDetails}
                options={cardNavigationOptions}
            />
        </StartStack.Navigator>
    );
};

export type StartStackNavigationProp<
    Screen extends keyof StartStackParams
> = NativeStackNavigationProp<StartStackParams, Screen>;

export type StartStackRouteProp<
    Screen extends keyof StartStackParams
> = RouteProp<StartStackParams, Screen>;

export default StartStackNavigator;

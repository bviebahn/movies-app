import { RouteProp } from "@react-navigation/native";
import {
    createStackNavigator,
    StackNavigationProp,
} from "@react-navigation/stack";
import React from "react";

import MovieDetails from "../screens/MovieDetails";
import Search from "../screens/Search";
import SeasonDetails from "../screens/SeasonDetails";
import TvShowDetails from "../screens/TvShowDetails";
import { Movie, Season, TvShow } from "../tmdb/types";
import { cardNavigationOptions } from "./navigationOptions";
import PersonDetails from "../screens/PersonDetails";

type SearchStackParams = {
    Search: undefined;
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

const SearchStack = createStackNavigator<SearchStackParams>();

const SearchStackNavigator: React.FC = () => {
    return (
        <SearchStack.Navigator
            screenOptions={{
                headerTransparent: true,
                headerTitle: () => null,
                headerBackTitleVisible: false,
            }}
            initialRouteName="Search">
            <SearchStack.Screen name="Search" component={Search} />
            <SearchStack.Screen
                name="MovieDetails"
                component={MovieDetails}
                options={cardNavigationOptions}
            />
            <SearchStack.Screen
                name="TvShowDetails"
                component={TvShowDetails}
                options={cardNavigationOptions}
            />
            <SearchStack.Screen
                name="SeasonDetails"
                component={SeasonDetails}
                options={cardNavigationOptions}
            />
            <SearchStack.Screen
                name="PersonDetails"
                component={PersonDetails}
                options={cardNavigationOptions}
            />
        </SearchStack.Navigator>
    );
};

export type SearchStackNavigationProp<
    Screen extends keyof SearchStackParams
> = StackNavigationProp<SearchStackParams, Screen>;

export type SearchStackRouteProp<
    Screen extends keyof SearchStackParams
> = RouteProp<SearchStackParams, Screen>;

export default SearchStackNavigator;

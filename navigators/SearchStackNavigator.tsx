import { RouteProp } from "@react-navigation/native";
import {
    createNativeStackNavigator,
    NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import React from "react";
import MovieDetails from "../screens/MovieDetails";
import PersonDetails from "../screens/PersonDetails";
import Search from "../screens/Search";
import SeasonDetails from "../screens/SeasonDetails";
import TvShowDetails from "../screens/TvShowDetails";
import { Movie, Season, TvShow } from "../tmdb/types";
import { cardNavigationOptions } from "./navigationOptions";

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

const SearchStack = createNativeStackNavigator<SearchStackParams>();

const SearchStackNavigator: React.FC = () => {
    return (
        <SearchStack.Navigator initialRouteName="Search">
            <SearchStack.Screen
                name="Search"
                component={Search}
                options={{ headerShown: false }}
            />
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
> = NativeStackNavigationProp<SearchStackParams, Screen>;

export type SearchStackRouteProp<
    Screen extends keyof SearchStackParams
> = RouteProp<SearchStackParams, Screen>;

export default SearchStackNavigator;

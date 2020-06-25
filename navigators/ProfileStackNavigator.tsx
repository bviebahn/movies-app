import { RouteProp } from "@react-navigation/native";
import {
    createStackNavigator,
    StackNavigationProp,
} from "@react-navigation/stack";
import React from "react";

import AccountList from "../screens/AccountList";
import Authenticate from "../screens/Authenticate";
import MovieDetails from "../screens/MovieDetails";
import Profile from "../screens/Profile";
import SeasonDetails from "../screens/SeasonDetails";
import TvShowDetails from "../screens/TvShowDetails";
import { Movie, Season, TvShow } from "../tmdb/types";
import {
    accountListNavigationOptions,
    cardNavigationOptions,
} from "./navigationOptions";
import { AccountListType } from "../tmdb/useAccountList";
import PersonDetails from "../screens/PersonDetails";

type ProfileStackParams = {
    Profile: undefined;
    Authenticate: {
        requestToken: string;
    };
    AccountList: {
        type: AccountListType;
    };
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

const ProfileStack = createStackNavigator<ProfileStackParams>();

const ProfileStackNavigator: React.FC = () => {
    return (
        <ProfileStack.Navigator
            screenOptions={{
                headerTransparent: true,
                headerTitle: () => null,
                headerBackTitleVisible: false,
            }}
            initialRouteName="Profile">
            <ProfileStack.Screen name="Profile" component={Profile} />
            <ProfileStack.Screen
                name="Authenticate"
                component={Authenticate}
                options={{
                    headerTransparent: false,
                    headerBackTitleVisible: true,
                }}
            />
            <ProfileStack.Screen
                name="AccountList"
                component={AccountList}
                options={accountListNavigationOptions}
            />
            <ProfileStack.Screen
                name="MovieDetails"
                component={MovieDetails}
                options={cardNavigationOptions}
            />
            <ProfileStack.Screen
                name="TvShowDetails"
                component={TvShowDetails}
                options={cardNavigationOptions}
            />
            <ProfileStack.Screen
                name="SeasonDetails"
                component={SeasonDetails}
                options={cardNavigationOptions}
            />
            <ProfileStack.Screen
                name="PersonDetails"
                component={PersonDetails}
                options={cardNavigationOptions}
            />
        </ProfileStack.Navigator>
    );
};

export type ProfileStackNavigationProp<
    Screen extends keyof ProfileStackParams
> = StackNavigationProp<ProfileStackParams, Screen>;

export type ProfileStackRouteProp<
    Screen extends keyof ProfileStackParams
> = RouteProp<ProfileStackParams, Screen>;

export default ProfileStackNavigator;

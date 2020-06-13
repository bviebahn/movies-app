import { RouteProp } from "@react-navigation/native";
import {
    createStackNavigator,
    StackNavigationProp,
} from "@react-navigation/stack";
import React from "react";

import Authenticate from "../screens/Authenticate";
import Profile from "../screens/Profile";

type ProfileStackParams = {
    Profile: undefined;
    Authenticate: {
        requestToken: string;
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
            <ProfileStack.Screen name="Authenticate" component={Authenticate} />
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

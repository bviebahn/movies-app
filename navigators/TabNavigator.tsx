import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { primaryColor } from "../constants/colors";
import ProfileStackNavigator from "./ProfileStackNavigator";
import SearchStackNavigator from "./SearchStackNavigator";
import StartStackNavigator from "./StartStackNavigator";

type TabParams = {
    StartTab: undefined;
    SearchTab: undefined;
    ProfileTab: undefined;
};

const TabIcon: React.FC<{ route: keyof TabParams; focused: boolean }> = ({
    route,
    focused,
}) => {
    const color = focused ? primaryColor : "#777";
    switch (route) {
        case "StartTab":
            return <Icon name="home" size={24} color={color} />;
        case "SearchTab":
            return <Icon name="search" size={20} color={color} />;
        case "ProfileTab":
            return <Icon name="user-circle" size={24} color={color} />;
    }
};

const Tab = createBottomTabNavigator<TabParams>();

const TabNavigator: React.FC = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => (
                <TabIcon route={route.name} focused={focused} />
            ),
            tabBarShowLabel: false,
            headerShown: false,
        })}>
        <Tab.Screen name="StartTab" component={StartStackNavigator} />
        <Tab.Screen name="SearchTab" component={SearchStackNavigator} />
        <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} />
    </Tab.Navigator>
);

export default TabNavigator;

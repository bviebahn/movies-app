import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";

import { gray1, primaryColor } from "../constants/colors";
import SearchStackNavigator from "./SearchStackNavigator";
import StartStackNavigator from "./StartStackNavigator";

type TabParams = {
    Start: undefined;
    Search: undefined;
};

const TabIcon: React.FC<{ route: keyof TabParams; focused: boolean }> = ({
    route,
    focused,
}) => {
    const color = focused ? primaryColor : "#777";
    switch (route) {
        case "Start":
            return <Icon name="home" size={24} color={color} />;
        case "Search":
            return <Icon name="search" size={20} color={color} />;
        default:
            return null;
    }
};

const Tab = createBottomTabNavigator<TabParams>();

const TabNavigator: React.FC = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => (
                <TabIcon route={route.name} focused={focused} />
            ),
        })}
        tabBarOptions={{
            showLabel: false,
            style: { backgroundColor: gray1 },
        }}>
        <Tab.Screen name="Start" component={StartStackNavigator} />
        <Tab.Screen name="Search" component={SearchStackNavigator} />
    </Tab.Navigator>
);

export default TabNavigator;

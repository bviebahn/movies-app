import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Icon from "react-native-vector-icons/FontAwesome";
import Saved from "../screens/Saved";
import { gray1, primaryColor } from "../constants/colors";

type TabParams = {
    Home: undefined;
    Saved: undefined;
};

const TabIcon: React.FC<{ route: keyof TabParams; focused: boolean }> = ({
    route,
    focused,
}) => {
    const color = focused ? primaryColor : "#777";
    switch (route) {
        case "Home":
            return <Icon name="home" size={24} color={color} />;
        case "Saved":
            return <Icon name="bookmark" size={24} color={color} />;
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
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Saved" component={Saved} />
    </Tab.Navigator>
);

export default TabNavigator;

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={Home} />
  </Tab.Navigator>
);

export default TabNavigator;

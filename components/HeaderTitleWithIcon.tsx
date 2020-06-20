import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { View, StyleSheet, Text } from "react-native";
import { textColor } from "../constants/colors";

const HeaderTitleWithIcon: React.FC<{
    title: string;
    iconName: string;
    iconColor: string;
}> = ({ title, iconName, iconColor }) => (
    <View style={styles.headerTitleWithIcon}>
        <Icon name={iconName} size={24} color={iconColor} />
        <Text style={styles.title}>{title}</Text>
    </View>
);

const styles = StyleSheet.create({
    headerTitleWithIcon: {
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        color: textColor,
        fontWeight: "bold",
        fontSize: 18,
        marginLeft: 10,
    },
});

export default HeaderTitleWithIcon;

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import { textColorSecondary } from "../constants/colors";
import { shadowStyle } from "../constants/styles";

type Props = {
    iconName: string;
    iconColor: string;
    title: string;
    backgroundColor: string;
    onPress: () => void;
};

const ListTile: React.FC<Props> = ({
    iconName,
    iconColor,
    title,
    backgroundColor,
    onPress,
}) => (
    <View style={shadowStyle}>
        <RectButton
            onPress={onPress}
            style={[styles.listTile, { backgroundColor }]}>
            <View style={styles.iconWrapper}>
                <Icon name={iconName} color={iconColor} size={32} />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Icon
                name="chevron-circle-right"
                size={24}
                color={`${iconColor}80`}
                style={styles.arrowIcon}
            />
        </RectButton>
    </View>
);

const styles = StyleSheet.create({
    listTile: {
        padding: 20,
        borderRadius: 8,
        flexDirection: "row",
        margin: 20,
        marginBottom: 0,
        alignItems: "center",
    },
    iconWrapper: {
        width: 32,
        height: 32,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: textColorSecondary,
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 10,
    },
    arrowIcon: {
        marginLeft: "auto",
    },
});

export default ListTile;

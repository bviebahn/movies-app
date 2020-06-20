import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BorderlessButton } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";

import { textColorSecondary } from "../constants/colors";
import { shadowStyle } from "../constants/styles";
import translate from "../i18/Locale";

type Props = {
    iconName: string;
    iconColor: string;
    title: string;
    backgroundColor: string;
    onPress: (type: "movie" | "tv") => void;
};

const ListTile: React.FC<Props> = ({
    iconName,
    iconColor,
    title,
    backgroundColor,
    onPress,
}) => (
    <View style={[styles.listTile, { backgroundColor }, shadowStyle]}>
        <View style={styles.iconWrapper}>
            <Icon name={iconName} color={iconColor} size={32} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.buttonWrapper}>
            <BorderlessButton
                onPress={() => onPress("movie")}
                rippleColor={iconColor}
                style={[styles.button, styles.buttonLeft]}>
                <Text style={styles.buttonText}>{translate("MOVIES")}</Text>
            </BorderlessButton>
            <View style={styles.divider} />
            <BorderlessButton
                onPress={() => onPress("tv")}
                rippleColor={iconColor}
                style={[styles.button, styles.buttonRight]}>
                <Text style={styles.buttonText}>{translate("TV_SHOWS")}</Text>
            </BorderlessButton>
        </View>
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
    buttonWrapper: {
        flexDirection: "row",
        marginLeft: "auto",
        alignItems: "center",
        backgroundColor: "#00000040",
        borderRadius: 8,
    },
    buttonText: {
        color: "#ffffffa0",
        fontWeight: "bold",
    },
    divider: {
        width: 1,
        height: 32,
        backgroundColor: "#00000030",
    },
    button: { paddingVertical: 15, paddingHorizontal: 10 },
    buttonLeft: {
        borderBottomLeftRadius: 8,
        borderTopLeftRadius: 8,
    },
    buttonRight: {
        borderBottomRightRadius: 8,
        borderTopRightRadius: 8,
    },
});

export default ListTile;

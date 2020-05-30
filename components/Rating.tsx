import React from "react";
import CircularProgress from "./CircularProgress";
import { StyleSheet, StyleProp, ViewStyle, Text } from "react-native";
import { textColor, gray1 } from "../constants/colors";

const colors = {
    bad: ["#db2360", "#571435"],
    average: ["#d3d630", "#403c0f"],
    good: ["#21ce78", "#204529"],
};

function colorFromRating(rating: number) {
    if (rating < 40) {
        return colors.bad;
    }

    return rating < 70 ? colors.average : colors.good;
}

const Rating: React.FC<{ percent: number; style: StyleProp<ViewStyle> }> = ({
    percent,
    style,
}) => {
    const color = colorFromRating(percent);
    return (
        <CircularProgress
            size={40}
            progressWidth={2}
            progress={percent}
            progressColor={color[0]}
            progressTintColor={color[1]}
            backgroundColor={gray1}
            style={style}>
            <Text style={styles.text}>{percent}</Text>
        </CircularProgress>
    );
};

const styles = StyleSheet.create({
    text: {
        position: "absolute",
        color: textColor,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        left: 11,
        top: 11,
        fontWeight: "bold",
    },
});

export default Rating;

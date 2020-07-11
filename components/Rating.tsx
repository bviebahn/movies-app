import React, { useState } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import { gray1, textColor, textColorSecondary } from "../constants/colors";
import CircularProgress from "./CircularProgress";
import translate from "../i18/Locale";

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

type Props = {
    percent: number;
    style?: StyleProp<ViewStyle>;
};

export const RatingWithVoteCount: React.FC<Props & { voteCount: number }> = ({
    percent,
    voteCount,
    style,
}) => {
    const [isToggled, setToggled] = useState(false);

    return (
        <View style={style}>
            <TouchableWithoutFeedback
                onPress={() => {
                    setToggled(t => !t);
                }}
                style={styles.touchable}>
                {isToggled ? (
                    <View style={styles.voteCountWrapper}>
                        <Text style={styles.voteCountText}>
                            {translate("VOTE_COUNT", { voteCount })}
                        </Text>
                    </View>
                ) : undefined}
                <Rating percent={percent} />
            </TouchableWithoutFeedback>
        </View>
    );
};

const Rating: React.FC<Props> = ({ percent, style }) => {
    const color = colorFromRating(percent);

    return (
        <CircularProgress
            size={40}
            progressWidth={2}
            progress={percent}
            progressColor={color[0]}
            progressTintColor={color[1]}
            backgroundColor={gray1}
            style={[style, styles.circle]}>
            <Text style={styles.text}>{Math.floor(percent)}</Text>
        </CircularProgress>
    );
};

const styles = StyleSheet.create({
    circle: { justifyContent: "center", alignItems: "center" },
    text: {
        position: "absolute",
        color: textColor,
        overflow: "hidden",
        fontWeight: "bold",
    },
    touchable: { flexDirection: "row" },
    voteCountWrapper: {
        height: 40,
        color: textColorSecondary,
        backgroundColor: "#000000CC",
        justifyContent: "center",
        paddingLeft: 20,
        paddingRight: 30,
        marginRight: -20,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
    },
    voteCountText: {
        color: textColorSecondary,
        fontWeight: "bold",
    },
});

export default Rating;

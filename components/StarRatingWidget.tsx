import React, { useState } from "react";
import {
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import StarRating from "react-native-star-rating-widget";
import Icon from "react-native-vector-icons/FontAwesome";

import { shadowStyle } from "../constants/styles";
import Blur from "./Blur";
import { yellowLight } from "../constants/colors";

type Props = {
    initialValue?: number;
    onRate: (rating?: number) => void;
    blurBackground?: boolean;
    style?: StyleProp<ViewStyle>;
};

const StarRatingWidget: React.FC<Props> = ({
    initialValue = 0,
    blurBackground = false,
    onRate,
    style,
}) => {
    const [rating, setRating] = useState(initialValue);
    return (
        <View style={[styles.starRatingWrapper, shadowStyle, style]}>
            {blurBackground ? <Blur style={styles.blur} /> : undefined}
            <TouchableOpacity
                onPress={() => onRate(undefined)}
                disabled={!initialValue}>
                <Icon
                    name="times-circle"
                    size={24}
                    color={initialValue ? "#f44336" : "#f4433650"}
                />
            </TouchableOpacity>
            <StarRating
                rating={rating}
                onChange={setRating}
                emptyColor={yellowLight}
                style={styles.starRating}
            />
            <TouchableOpacity
                onPress={() => onRate(rating)}
                disabled={rating === initialValue}>
                <Icon
                    name="check-circle"
                    size={24}
                    color={rating === initialValue ? "#4caf5050" : "#4caf50"}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    starRatingWrapper: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 24,
    },
    starRating: {
        marginHorizontal: 10,
    },
    blur: {
        borderRadius: 24,
    },
});

export default StarRatingWidget;

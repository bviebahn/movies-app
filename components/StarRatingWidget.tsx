import React, { useState } from "react";
import { shadowStyle } from "../constants/styles";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    StyleProp,
    ViewStyle,
} from "react-native";
import Blur from "./Blur";
import Icon from "react-native-vector-icons/FontAwesome";
import StarRating from "./StarRating";

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

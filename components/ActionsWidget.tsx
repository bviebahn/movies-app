import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
    primaryColorDark,
    textColorSecondary,
    gray2,
} from "../constants/colors";
import { shadowStyle } from "../constants/styles";
import StarRating from "./StarRating";

type ButtonProps = {
    icon: string;
    onPress: () => void;
    color: string;
};

const Button: React.FC<ButtonProps> = ({ icon, onPress, color }) => (
    <TouchableOpacity onPress={onPress} style={[styles.button, shadowStyle]}>
        <Icon name={icon} size={16} color={color} />
    </TouchableOpacity>
);

type ActionsWidgetProps = {
    isFavorite: boolean;
    isOnWatchlist: boolean;
    rating: number;
    onAddToList: () => void;
    onMarkAsFavorite: () => void;
    onAddToWatchlist: () => void;
    onRate: (rating?: number) => void;
};

const ActionsWidget: React.FC<ActionsWidgetProps> = ({
    isFavorite,
    isOnWatchlist,
    rating,
    onAddToList,
    onMarkAsFavorite,
    onAddToWatchlist,
    onRate,
}) => {
    const [ratingVisible, setRatingVisible] = useState(false);
    const [ratingValue, setRatingValue] = useState(rating);

    useEffect(() => {
        setRatingValue(rating);
    }, [rating]);

    const toggleRating = () => {
        setRatingVisible((prev) => !prev);
    };

    return (
        <View style={styles.actionsWidget}>
            <Button
                icon="list"
                onPress={onAddToList}
                color={textColorSecondary}
            />
            <Button
                icon="heart"
                onPress={onMarkAsFavorite}
                color={isFavorite ? "#ad1457" : textColorSecondary}
            />
            <Button
                icon="bookmark"
                onPress={onAddToWatchlist}
                color={isOnWatchlist ? "#00838f" : textColorSecondary}
            />
            <Button
                icon="star"
                onPress={toggleRating}
                color={rating ? "#f9a825" : textColorSecondary}
            />
            {ratingVisible ? (
                <View style={[styles.starRatingWrapper, shadowStyle]}>
                    <TouchableOpacity
                        onPress={() => onRate(undefined)}
                        disabled={!rating}>
                        <Icon
                            name="times-circle"
                            size={24}
                            color={rating ? "#f44336" : "#f4433650"}
                        />
                    </TouchableOpacity>
                    <StarRating
                        rating={ratingValue}
                        onChange={setRatingValue}
                        style={styles.starRating}
                    />
                    <TouchableOpacity
                        onPress={() => onRate(ratingValue)}
                        disabled={ratingValue === rating}>
                        <Icon
                            name="check-circle"
                            size={24}
                            color={
                                ratingValue === rating ? "#4caf5050" : "#4caf50"
                            }
                        />
                    </TouchableOpacity>
                </View>
            ) : undefined}
        </View>
    );
};

const styles = StyleSheet.create({
    actionsWidget: {
        padding: 10,
        flexDirection: "row",
        justifyContent: "center",
    },
    button: {
        width: 48,
        height: 48,
        backgroundColor: primaryColorDark,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
    },
    starRatingWrapper: {
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        padding: 10,
        paddingHorizontal: 20,
        backgroundColor: gray2,
        borderRadius: 32,
        bottom: 80,
    },
    starRating: {
        marginHorizontal: 10,
    },
});

export default ActionsWidget;

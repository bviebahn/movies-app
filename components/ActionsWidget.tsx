import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
    favoriteRed,
    primaryColorDark,
    ratedYellow,
    textColorSecondary,
    watchlistGreen,
} from "../constants/colors";
import { shadowStyle } from "../constants/styles";
import StarRatingWidget from "./StarRatingWidget";

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

    const toggleRating = () => {
        setRatingVisible(prev => !prev);
    };

    const handleRate = (value?: number) => {
        onRate(value);
        setRatingVisible(false);
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
                color={isFavorite ? favoriteRed : textColorSecondary}
            />
            <Button
                icon="bookmark"
                onPress={onAddToWatchlist}
                color={isOnWatchlist ? watchlistGreen : textColorSecondary}
            />
            <Button
                icon="star"
                onPress={toggleRating}
                color={rating ? ratedYellow : textColorSecondary}
            />
            {ratingVisible ? (
                <StarRatingWidget
                    initialValue={rating}
                    onRate={handleRate}
                    blurBackground
                    style={styles.starRating}
                />
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
    starRating: {
        position: "absolute",
        bottom: 80,
    },
    blur: {
        borderRadius: 24,
    },
});

export default ActionsWidget;

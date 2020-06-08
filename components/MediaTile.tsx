import React from "react";
import {
    Image,
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import {
    gray2,
    gray3,
    textColor,
    textColorSecondary,
} from "../constants/colors";
import { shadowStyle } from "../constants/styles";
import { getPosterUrl } from "../tmdb/util";
import Rating from "./Rating";
import { TILE_WIDTH_M, TILE_WIDTH_S } from "../constants/values";

type Props = {
    posterPath?: string;
    title: string;
    subtitle: string;
    voteAverage?: number;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    size?: "small" | "medium";
};

const MediaTile: React.FC<Props> = ({
    posterPath,
    title,
    subtitle,
    voteAverage,
    onPress,
    style,
    size = "medium",
}) => {
    const width = size === "medium" ? TILE_WIDTH_M : TILE_WIDTH_S;
    const imageHeight = width * 1.5;

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.mediaTile,
                shadowStyle,
                {
                    width,
                    height: width * 2 + 20,
                },
                style,
            ]}>
            {posterPath ? (
                <Image
                    source={{ uri: getPosterUrl(posterPath) }}
                    style={[styles.image, { height: imageHeight }]}
                />
            ) : (
                <View style={styles.placeholderImage}>
                    <Icon name="image" size={64} color={textColorSecondary} />
                </View>
            )}
            {voteAverage ? (
                <Rating percent={voteAverage * 10} style={styles.rating} />
            ) : undefined}
            <View style={styles.infoContainer}>
                <Text numberOfLines={2} style={styles.title}>
                    {title}
                </Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    mediaTile: {
        backgroundColor: gray2,
        borderRadius: 8,
    },
    title: {
        color: textColor,
        fontSize: 16,
        fontWeight: "bold",
    },
    image: {
        width: "100%",
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
    },
    placeholderImage: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    infoContainer: {
        flex: 1,
        marginHorizontal: 10,
        justifyContent: "center",
    },
    subtitle: {
        color: gray3,
        marginTop: 5,
    },
    rating: { position: "absolute", top: 220, right: 10 },
});

export default MediaTile;

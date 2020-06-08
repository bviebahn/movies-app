import React from "react";
import {
    ViewStyle,
    StyleProp,
    TouchableOpacity,
    Image,
    View,
    Text,
    StyleSheet,
} from "react-native";
import { shadowStyle } from "../constants/styles";
import { getPosterUrl } from "../tmdb/util";
import Rating from "./Rating";
import { gray2, textColor, gray3 } from "../constants/colors";

type Props = {
    posterPath?: string;
    title: string;
    subtitle: string;
    voteAverage?: number;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
};

const TILE_WIDTH = 160;
const TILE_HORIZONTAL_MARGIN = 10;
export const TOTAL_TILE_WIDTH = TILE_WIDTH + TILE_HORIZONTAL_MARGIN * 2;

const MovieTile: React.FC<Props> = ({
    posterPath,
    title,
    subtitle,
    voteAverage,
    onPress,
    style,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.mediaTile, shadowStyle, style]}>
            {posterPath ? (
                <Image
                    source={{ uri: getPosterUrl(posterPath) }}
                    style={styles.image}
                />
            ) : undefined}
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
        marginHorizontal: TILE_HORIZONTAL_MARGIN,
        marginVertical: 10,
        height: 340,
        width: TILE_WIDTH,
        borderRadius: 8,
    },
    title: {
        color: textColor,
        fontSize: 16,
        fontWeight: "bold",
    },
    image: {
        height: 240,
        width: TILE_WIDTH,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
    },
    infoContainer: {
        flex: 1,
        margin: 10,
        marginTop: 25,
    },
    subtitle: {
        color: gray3,
        marginTop: 5,
    },
    rating: { position: "absolute", top: 220, right: 10 },
});

export default MovieTile;

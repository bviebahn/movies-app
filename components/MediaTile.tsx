import React from "react";
import {
    Image,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from "react-native";
import { BorderlessButton } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";

import {
    gray2,
    gray5,
    textColor,
    textColorSecondary,
} from "../constants/colors";
import { shadowStyle } from "../constants/styles";
import { TILE_WIDTH_M, TILE_WIDTH_S } from "../constants/values";
import Rating from "./Rating";

type Props = {
    imageUrl?: string;
    title: string;
    subtitle?: string;
    voteAverage?: number;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    size?: "small" | "medium";
};

const MediaTile: React.FC<Props> = ({
    imageUrl,
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
        <View style={shadowStyle}>
            <BorderlessButton
                onPress={onPress}
                rippleColor="#000"
                style={[
                    styles.mediaTile,
                    {
                        width,
                        height: width * 2 + 20,
                    },
                    style,
                ]}>
                {imageUrl ? (
                    <Image
                        source={{ uri: imageUrl }}
                        style={[styles.image, { height: imageHeight }]}
                    />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Icon
                            name="image"
                            size={64}
                            color={textColorSecondary}
                        />
                    </View>
                )}
                {voteAverage ? (
                    <Rating percent={voteAverage * 10} style={styles.rating} />
                ) : undefined}
                <View style={styles.infoContainer}>
                    <Text numberOfLines={2} style={styles.title}>
                        {title}
                    </Text>
                    {subtitle ? (
                        <Text style={styles.subtitle}>{subtitle}</Text>
                    ) : undefined}
                </View>
            </BorderlessButton>
        </View>
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
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    infoContainer: {
        flex: 1,
        marginHorizontal: 10,
        justifyContent: "center",
    },
    subtitle: {
        color: gray5,
        marginTop: 5,
    },
    rating: { position: "absolute", top: 220, right: 10 },
});

export default MediaTile;

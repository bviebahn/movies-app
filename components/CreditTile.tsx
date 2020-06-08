import React from "react";
import {
    View,
    TouchableOpacity,
    Image,
    Text,
    StyleProp,
    ViewStyle,
    StyleSheet,
} from "react-native";
import { getPosterUrl } from "../tmdb/util";
import { gray2, textColor, textColorSecondary } from "../constants/colors";
import { shadowStyle } from "../constants/styles";

type Props = {
    name: string;
    character: string;
    profilePath?: string;
    style?: StyleProp<ViewStyle>;
};

export const TILE_WIDTH = 140;

const CreditTile: React.FC<Props> = ({
    name,
    character,
    profilePath,
    style,
}) => (
    <TouchableOpacity style={[styles.creditTile, shadowStyle, style]}>
        {profilePath ? (
            <Image
                source={{ uri: getPosterUrl(profilePath) }}
                style={styles.image}
            />
        ) : undefined}
        <View style={styles.infoContainer}>
            <Text style={styles.name} numberOfLines={2}>
                {name}
            </Text>
            <Text style={styles.character} numberOfLines={2}>
                {character}
            </Text>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    creditTile: {
        flex: 1,
        backgroundColor: gray2,
        height: 260,
        width: TILE_WIDTH,
        borderRadius: 8,
    },
    image: {
        height: 160,
        width: TILE_WIDTH,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
    },
    infoContainer: {
        margin: 10,
    },
    name: {
        color: textColor,
        fontSize: 16,
        fontWeight: "bold",
    },
    character: {
        color: textColorSecondary,
        marginTop: 4,
    },
});

export default CreditTile;

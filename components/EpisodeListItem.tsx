import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
    gray0,
    textColorSecondary,
    gray3,
    primaryColor,
} from "../constants/colors";
import Rating from "./Rating";

type Props = {
    episode: {
        name: string;
        episodeNumber: number;
        overview: string;
        voteAverage: number;
    };
};

const EpisodeListItem: React.FC<Props> = ({ episode }) => (
    <View style={styles.episodeItem}>
        <Text style={styles.episodeNumber}>{episode.episodeNumber}.</Text>
        <View style={styles.episodeInfo}>
            <Text style={styles.episodeTitle}>{episode.name}</Text>
            <Text style={styles.episodeOverview} numberOfLines={5}>
                {episode.overview}
            </Text>
        </View>
        <Rating percent={episode.voteAverage * 10} style={styles.rating} />
    </View>
);

const styles = StyleSheet.create({
    episodeItem: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flex: 1,
        flexDirection: "row",
        backgroundColor: gray0,
        borderBottomColor: "#000",
        borderBottomWidth: 1,
    },
    episodeInfo: { flexShrink: 1, marginRight: 10 },
    episodeTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: textColorSecondary,
        marginBottom: 5,
    },
    episodeNumber: {
        fontSize: 16,
        fontWeight: "bold",
        color: gray3,
        marginRight: 2,
    },
    episodeOverview: {
        color: gray3,
        flexShrink: 1,
    },
    rating: { marginLeft: "auto" },
});

export default EpisodeListItem;

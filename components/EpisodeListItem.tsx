import React, { useState } from "react";
import { LayoutAnimation, StyleSheet, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";

import { gray0, gray2, gray3, textColorSecondary } from "../constants/colors";
import Rating from "./Rating";
import StarRatingWidget from "./StarRatingWidget";

type Props = {
    episode: {
        name: string;
        episodeNumber: number;
        overview: string;
        voteAverage: number;
    };
    rating: number;
    onRate: (rating?: number) => void;
};

const EpisodeListItem: React.FC<Props> = ({ episode, onRate, rating }) => {
    const [expanded, setExpanded] = useState(false);

    const handleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded((value) => !value);
    };

    return (
        <View style={styles.episodeItem}>
            <RectButton onPress={handleExpand} style={styles.button}>
                <View style={styles.content}>
                    <Text style={styles.episodeNumber}>
                        {episode.episodeNumber}.
                    </Text>
                    <View style={styles.episodeInfo}>
                        <Text style={styles.episodeTitle}>{episode.name}</Text>
                        <Text
                            style={styles.episodeOverview}
                            numberOfLines={expanded ? undefined : 5}>
                            {episode.overview}
                        </Text>
                    </View>
                    <View>
                        <Rating
                            percent={episode.voteAverage * 10}
                            style={styles.rating}
                        />
                    </View>
                </View>
            </RectButton>
            {expanded ? (
                <StarRatingWidget
                    initialValue={rating}
                    onRate={onRate}
                    style={styles.starRating}
                />
            ) : undefined}
        </View>
    );
};

const styles = StyleSheet.create({
    episodeItem: {
        flex: 1,
        backgroundColor: gray0,
        borderBottomColor: gray2,
        borderBottomWidth: 1,
    },
    button: { paddingHorizontal: 20, paddingVertical: 10 },
    content: {
        flexDirection: "row",
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
    starRating: {
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 10,
    },
});

export default EpisodeListItem;

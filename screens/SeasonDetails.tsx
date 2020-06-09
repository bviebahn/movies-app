import { useRoute } from "@react-navigation/native";
import React, { useRef } from "react";
import { Animated, FlatList, StyleSheet, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import Rating from "../components/Rating";
import {
    gray0,
    gray3,
    primaryColor,
    textColor,
    textColorSecondary,
} from "../constants/colors";
import { headline, secondaryText } from "../constants/styles";
import translate from "../i18/Locale";
import { StartStackRouteProp } from "../navigators/StartStackNavigator";
import useSeasonDetails from "../tmdb/useSeasonDetails";
import { getPosterUrl } from "../tmdb/util";
import { formatDate } from "../util/date";

const SeasonDetails: React.FC = () => {
    const route = useRoute<StartStackRouteProp<"SeasonDetails">>();
    const {
        tvShowId,
        season: { airDate, name, overview, posterPath, seasonNumber },
    } = route.params;
    const { seasonDetails } = useSeasonDetails(tvShowId, seasonNumber);
    const { episodes } = seasonDetails || {};

    const parallaxAnim = useRef(new Animated.Value(0));

    const topContent = (
        <View style={styles.topInfoWrapper}>
            <LinearGradient
                colors={["#00000000", "#000000DD", "#000000"]}
                locations={[0, 0.6, 0.95]}
                style={styles.posterGradient}
            />
            <View style={styles.topInfo}>
                <Text
                    style={[
                        styles.title,
                        name.length > 40 && styles.titleSmall,
                    ]}>
                    {name}
                </Text>
                <Text style={secondaryText}>
                    {formatDate(new Date(airDate))}
                </Text>
            </View>
            {overview ? (
                <Text style={styles.overview}>{overview}</Text>
            ) : undefined}
            <Text style={[styles.episodeListTitle, headline]}>
                {translate("EPISODES")}
            </Text>
        </View>
    );

    return (
        <View>
            {posterPath ? (
                <Animated.Image
                    source={{ uri: getPosterUrl(posterPath) }}
                    style={[
                        styles.poster,
                        {
                            transform: [
                                {
                                    translateY: parallaxAnim.current.interpolate(
                                        {
                                            inputRange: [0, 1],
                                            outputRange: [0, -0.4],
                                        },
                                    ),
                                },
                            ],
                        },
                    ]}
                />
            ) : undefined}
            <FlatList
                data={episodes}
                renderItem={({ item }) => (
                    <View style={styles.episodeItem}>
                        <View style={styles.episodeLeft}>
                            <Text
                                style={
                                    styles.episodeTitle
                                }>{`${item.episodeNumber}. ${item.name}`}</Text>
                            <Text
                                style={styles.episodeOverview}
                                numberOfLines={5}>
                                {item.overview}
                            </Text>
                        </View>
                        <Rating
                            percent={Math.floor(item.voteAverage * 10)}
                            style={styles.rating}
                        />
                    </View>
                )}
                keyExtractor={(item) => `${item.id}`}
                ListHeaderComponent={topContent}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                contentOffset: {
                                    y: parallaxAnim.current,
                                },
                            },
                        },
                    ],
                    { useNativeDriver: false },
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    topInfoWrapper: {
        paddingTop: 300,
    },
    topInfo: {
        marginLeft: 20,
    },
    poster: {
        width: "100%",
        height: 600,
        position: "absolute",
        top: 0,
        left: 0,
    },
    posterGradient: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        top: 100,
    },
    overview: {
        color: textColorSecondary,
        marginHorizontal: 20,
        marginVertical: 10,
    },
    title: {
        color: textColor,
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 5,
    },
    titleSmall: {
        fontSize: 20,
    },
    infoKey: {
        color: primaryColor,
        marginTop: 10,
        marginBottom: 2,
        fontWeight: "bold",
    },
    infoValue: {
        color: textColorSecondary,
    },
    episodeListTitle: {
        padding: 20,
        paddingBottom: 10,
    },
    episodeItem: {
        backgroundColor: gray0,
        paddingHorizontal: 20,
        paddingVertical: 10,
        flex: 1,
        flexDirection: "row",
        borderBottomColor: "#000",
        borderBottomWidth: 1,
    },
    episodeLeft: { flexShrink: 1, marginRight: 10 },
    episodeTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: textColorSecondary,
        marginBottom: 5,
    },
    episodeOverview: {
        color: gray3,
        flexShrink: 1,
    },
    rating: { marginLeft: "auto" },
});

export default SeasonDetails;

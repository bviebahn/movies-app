import { useNavigation, useRoute } from "@react-navigation/native";
import { getLanguage } from "iso-countries-languages";
import React from "react";
import {
    ActivityIndicator,
    Animated,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

import ActionsWidget from "../components/ActionsWidget";
import InfoBox from "../components/InfoBox";
import MediaTile from "../components/MediaTile";
import MediaWidget from "../components/MediaWidget";
import Rating from "../components/Rating";
import ReviewsWidget from "../components/ReviewsWidget";
import { gray1, textColor, textColorSecondary } from "../constants/colors";
import { dot, secondaryText, shadowStyle } from "../constants/styles";
import {
    TILE_HORIZONTAL_MARGIN,
    TILE_WIDTH_M,
    TILE_WIDTH_S,
} from "../constants/values";
import translate from "../i18/Locale";
import {
    StartStackNavigationProp,
    StartStackRouteProp,
} from "../navigators/StartStackNavigator";
import useAddToWatchlist from "../tmdb/useAddToWatchlist";
import useImageUrl from "../tmdb/useImageUrl";
import useMarkAsFavorite from "../tmdb/useMarkAsFavorite";
import useRate from "../tmdb/useRate";
import useTvShowDetails from "../tmdb/useTvShowDetails";
import { formatDate } from "../util/date";
import { convertMinutesToTimeString } from "../util/time";
import useParallax from "../util/useParallax";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TvShowDetails: React.FC = () => {
    const route = useRoute<StartStackRouteProp<"TvShowDetails">>();
    const navigation = useNavigation<
        StartStackNavigationProp<"TvShowDetails">
    >();

    const markAsFavorite = useMarkAsFavorite();
    const addToWatchlist = useAddToWatchlist();
    const rate = useRate();

    const { width: screenWidth } = useWindowDimensions();
    const getImageUrl = useImageUrl();
    const { style: parallaxStyle, scrollHandler } = useParallax(0.4);
    const { top } = useSafeAreaInsets();

    const {
        tvShow: {
            id,
            backdropPath,
            posterPath,
            name,
            firstAirDate,

            voteAverage,
            overview,
            originalLanguage,
        },
    } = route.params;

    const { data, status } = useTvShowDetails(id);

    const {
        credits,
        reviews,
        recommendations,
        genres,
        episodeRunTime,
        seasons,
        createdBy,
        accountStates,
    } = data || {};

    const { favorite, rated, watchlist } = accountStates || {};

    const backdropHeight = (screenWidth * 9) / 16;

    const infos = [
        ...(createdBy && createdBy.length
            ? [
                  {
                      key: translate("CREATOR", { n: createdBy.length }),
                      value: createdBy
                          .map((creator) => creator.name)
                          .join(", "),
                  },
              ]
            : []),
        {
            key: translate("ORIGINAL_LANGUAGE"),
            value: getLanguage("en", originalLanguage),
        },
        ...(genres && genres.length
            ? [
                  {
                      key: translate("GENRES"),
                      value: genres.map((genre) => genre.name).join(", "),
                  },
              ]
            : []),
    ];

    const handleAddToList = () => {};

    const handleMarkAsFavorite = () => {
        markAsFavorite("tv", id, !favorite);
    };

    const handleAddToWatchist = () => {
        addToWatchlist("tv", id, !watchlist);
    };

    const handleRate = (rating?: number) => {
        rate({ mediaType: "tv", mediaId: id, rating });
    };

    return (
        <ScrollView
            contentContainerStyle={styles.tvShowDetails}
            scrollEventThrottle={16}
            onScroll={scrollHandler}>
            {backdropPath ? (
                <Animated.Image
                    source={{
                        uri: getImageUrl(backdropPath, "backdrop", "medium"),
                    }}
                    style={[
                        styles.backdrop,
                        {
                            height: backdropHeight,
                        },
                        parallaxStyle,
                    ]}
                />
            ) : undefined}

            <View
                style={[
                    styles.mainContent,
                    !backdropPath && { marginTop: top + 40 },
                ]}>
                {posterPath ? (
                    <View style={[styles.posterWrapper, shadowStyle]}>
                        <Image
                            source={{
                                uri: getImageUrl(posterPath, "poster", "small"),
                            }}
                            style={styles.poster}
                        />
                    </View>
                ) : undefined}
                <View style={styles.infoContainer}>
                    <Text
                        style={[
                            styles.title,
                            name.length > 40 && styles.titleSmall,
                        ]}>
                        {name}
                    </Text>
                    <View style={styles.dateRuntimeWrapper}>
                        <Text style={secondaryText}>
                            {formatDate(new Date(firstAirDate))}
                        </Text>
                        {episodeRunTime ? (
                            <>
                                <View style={dot} />
                                <Text style={secondaryText}>
                                    {convertMinutesToTimeString(episodeRunTime)}
                                </Text>
                            </>
                        ) : undefined}
                    </View>
                    <InfoBox data={infos} />
                    {status === "loading" ? (
                        <ActivityIndicator style={styles.activityIndicator} />
                    ) : undefined}
                </View>
            </View>
            <Rating
                percent={voteAverage * 10}
                style={[styles.rating, { top: backdropHeight - 20 }]}
            />
            {data ? (
                <ActionsWidget
                    isFavorite={!!favorite}
                    isOnWatchlist={!!watchlist}
                    rating={rated || 0}
                    onAddToList={handleAddToList}
                    onMarkAsFavorite={handleMarkAsFavorite}
                    onAddToWatchlist={handleAddToWatchist}
                    onRate={handleRate}
                />
            ) : undefined}
            <View style={styles.overviewWrapper}>
                <Text style={styles.overview}>{overview}</Text>
            </View>
            {seasons ? (
                <MediaWidget
                    title={`${seasons.length} ${translate("SEASONS")}`}
                    data={seasons}
                    itemWidth={TILE_WIDTH_M + TILE_HORIZONTAL_MARGIN * 2}
                    renderItem={(season) => (
                        <MediaTile
                            title={season.name}
                            subtitle={`${season.episodeCount} ${translate(
                                "EPISODES",
                            )}`}
                            imageUrl={
                                season.posterPath
                                    ? getImageUrl(
                                          season.posterPath,
                                          "poster",
                                          "small",
                                      )
                                    : undefined
                            }
                            onPress={() =>
                                navigation.navigate("SeasonDetails", {
                                    tvShowId: id,
                                    season,
                                })
                            }
                            style={styles.tileMargin}
                        />
                    )}
                    keyExtractor={(item) => `${item.id}`}
                    style={styles.widget}
                />
            ) : undefined}
            {credits && credits.cast.length ? (
                <MediaWidget
                    title={translate("CAST")}
                    data={credits.cast.slice(0, 10)}
                    itemWidth={TILE_WIDTH_S + TILE_HORIZONTAL_MARGIN * 2}
                    renderItem={(credit) => (
                        <MediaTile
                            title={credit.name}
                            subtitle={credit.character}
                            imageUrl={
                                credit.profilePath
                                    ? getImageUrl(
                                          credit.profilePath,
                                          "profile",
                                          "medium",
                                      )
                                    : undefined
                            }
                            onPress={() => undefined}
                            style={styles.tileMargin}
                            size="small"
                        />
                    )}
                    keyExtractor={(credit) => `${credit.id}`}
                    style={styles.widget}
                />
            ) : undefined}
            {reviews && reviews.length ? (
                <ReviewsWidget reviews={reviews} style={styles.widget} />
            ) : undefined}
            {recommendations ? (
                <MediaWidget
                    title={translate("RECOMMENDATIONS")}
                    data={recommendations}
                    itemWidth={TILE_WIDTH_M + TILE_HORIZONTAL_MARGIN * 2}
                    renderItem={(tvShow) => (
                        <MediaTile
                            title={tvShow.name}
                            subtitle={formatDate(new Date(tvShow.firstAirDate))}
                            imageUrl={
                                tvShow.posterPath
                                    ? getImageUrl(
                                          tvShow.posterPath,
                                          "poster",
                                          "medium",
                                      )
                                    : undefined
                            }
                            voteAverage={tvShow.voteAverage}
                            onPress={() =>
                                navigation.push("TvShowDetails", { tvShow })
                            }
                            style={styles.tileMargin}
                        />
                    )}
                    keyExtractor={(item) => `${item.id}`}
                    style={styles.widget}
                />
            ) : undefined}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    tvShowDetails: {
        paddingBottom: 40,
    },
    backdrop: {
        width: "100%",
    },
    mainContent: {
        flexDirection: "row",
        backgroundColor: gray1,
        padding: 20,
    },
    posterWrapper: {
        margin: 8,
    },
    poster: {
        width: 160,
        height: 240,
        borderRadius: 8,
        marginTop: -60,
    },
    infoContainer: {
        marginLeft: 10,
        flex: 1,
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
    rating: { position: "absolute", right: 20 },
    overviewWrapper: {
        marginHorizontal: 20,
        marginBottom: 20,
        paddingTop: 20,
    },
    overview: {
        color: textColorSecondary,
    },
    activityIndicator: {
        marginTop: "auto",
        marginBottom: "auto",
    },
    tileMargin: {
        marginHorizontal: TILE_HORIZONTAL_MARGIN,
        marginVertical: 10,
    },
    dateRuntimeWrapper: {
        flexDirection: "row",
        marginTop: 5,
    },
    widget: {
        marginBottom: 20,
    },
});

export default TvShowDetails;

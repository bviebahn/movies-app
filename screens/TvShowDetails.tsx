import { useNavigation, useRoute } from "@react-navigation/native";
import { getLanguage } from "iso-countries-languages";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

import ActionsWidget from "../components/ActionsWidget";
import FeedbackMessage from "../components/FeedbackMessage";
import InfoBox from "../components/InfoBox";
import MediaTile from "../components/MediaTile";
import MediaWidget from "../components/MediaWidget";
import Rating from "../components/Rating";
import ReviewsWidget from "../components/ReviewsWidget";
import { textColor, textColorSecondary } from "../constants/colors";
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
import useImageUrl from "../tmdb/useImageUrl";
import useTvShowDetails from "../tmdb/useTvShowDetails";
import useUser from "../tmdb/useUser";
import { formatDate } from "../util/date";
import { convertMinutesToTimeString } from "../util/time";
import useDebounce from "../util/useDebounce";

const TvShowDetails: React.FC = () => {
    const route = useRoute<StartStackRouteProp<"TvShowDetails">>();
    const navigation = useNavigation<
        StartStackNavigationProp<"TvShowDetails">
    >();
    const { width: screenWidth } = useWindowDimensions();
    const getImageUrl = useImageUrl();

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

    const { tvShowDetails, loading, updateCache } = useTvShowDetails(id);

    const {
        credits,
        reviews,
        recommendations,
        genres,
        episodeRunTime,
        seasons,
        createdBy,
        accountStates,
    } = tvShowDetails || {};

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

    const [feedback, setFeedback] = useState<{
        icon?: string;
        title: string;
        message?: string;
        visible: boolean;
    }>({ title: "", visible: false });

    const showFeedback = (
        icon: string,
        feedbackTitle: string,
        message?: string,
    ) => {
        setFeedback({ icon, title: feedbackTitle, message, visible: true });
        hideFeedback();
    };

    const hideFeedback = useDebounce(() => {
        setFeedback((prev) => ({ ...prev, visible: false }));
    }, 2000);

    const { user, markAsFavorite, addToWatchlist, rate } = useUser();

    const handleAddToList = () => {};

    const handleMarkAsFavorite = async () => {
        if (user && tvShowDetails) {
            const revertCacheUpdate = updateCache({
                ...tvShowDetails,
                accountStates: {
                    ...tvShowDetails.accountStates,
                    favorite: !favorite,
                },
            });

            const { success, favorite: newFavorite } = await markAsFavorite(
                "tv",
                id,
                !favorite,
            );
            if (success) {
                showFeedback(
                    newFavorite ? "heart" : "heart-o",
                    translate("SUBMITTED"),
                );
            } else {
                revertCacheUpdate();
            }
        }
    };

    const handleAddToWatchist = async () => {
        if (user && tvShowDetails) {
            const revertCacheUpdate = updateCache({
                ...tvShowDetails,
                accountStates: {
                    ...tvShowDetails.accountStates,
                    watchlist: !watchlist,
                },
            });
            const { success, watchlist: newWatchlist } = await addToWatchlist(
                "tv",
                id,
                !watchlist,
            );
            if (success) {
                showFeedback(
                    newWatchlist ? "bookmark" : "bookmark-o",
                    translate("SUBMITTED"),
                );
            } else {
                revertCacheUpdate();
            }
        }
    };

    const handleRate = async (rating?: number) => {
        if (user && tvShowDetails) {
            const revertCacheUpdate = updateCache({
                ...tvShowDetails,
                accountStates: {
                    ...tvShowDetails.accountStates,
                    rated: rating || 0,
                },
            });
            const { success, rating: newRating } = await rate("tv", id, rating);

            if (success) {
                showFeedback(
                    newRating ? "star" : "star-o",
                    translate("SUBMITTED"),
                );
            } else {
                revertCacheUpdate();
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.tvShowDetails}>
            {backdropPath ? (
                <Image
                    source={{
                        uri: getImageUrl(backdropPath, "backdrop", "medium"),
                    }}
                    style={[styles.backdrop, { height: backdropHeight }]}
                />
            ) : undefined}
            <Rating
                percent={voteAverage * 10}
                style={[styles.rating, { top: backdropHeight - 20 }]}
            />
            <View style={styles.mainContent}>
                {posterPath ? (
                    <View style={[styles.posterWrapper, shadowStyle]}>
                        <Image
                            source={{
                                uri: getImageUrl(
                                    posterPath,
                                    "poster",
                                    "medium",
                                ),
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
                    {loading ? (
                        <ActivityIndicator style={styles.activityIndicator} />
                    ) : undefined}
                </View>
            </View>
            {tvShowDetails ? (
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
                                          "medium",
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
            <FeedbackMessage
                isVisible={feedback.visible}
                iconName={feedback.icon}
                title={feedback.title}
                message={feedback.message}
            />
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
        margin: 20,
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

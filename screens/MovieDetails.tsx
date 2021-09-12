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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActionsWidget from "../components/ActionsWidget";
import DotSeperatedLine from "../components/DotSeperatedLine";
import DynamicSizedTitle from "../components/DynamicSizedTitle";
import InfoBox from "../components/InfoBox";
import MediaTile from "../components/MediaTile";
import MediaWidget from "../components/MediaWidget";
import { RatingWithVoteCount } from "../components/Rating";
import ReviewsWidget from "../components/ReviewsWidget";
import { gray1, textColorSecondary } from "../constants/colors";
import { secondaryText, shadowStyle } from "../constants/styles";
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
import useMovieDetails from "../tmdb/useMovieDetails";
import useRate from "../tmdb/useRate";
import { formatDate } from "../util/date";
import { convertMinutesToTimeString } from "../util/time";
import useAccountListSelector from "../util/useAccountListSelector";
import useParallax from "../util/useParallax";

const MovieDetails: React.FC = () => {
    const route = useRoute<StartStackRouteProp<"MovieDetails">>();
    const navigation = useNavigation<
        StartStackNavigationProp<"MovieDetails">
    >();
    const { width: screenWidth } = useWindowDimensions();

    const { showAccountListSelector } = useAccountListSelector();
    const markAsFavorite = useMarkAsFavorite();
    const addToWatchlist = useAddToWatchlist();
    const rate = useRate();

    const {
        movie: {
            id,
            backdropPath,
            posterPath,
            title,
            releaseDate,
            voteAverage,
            overview,
            originalLanguage,
        },
    } = route.params;

    const { data, status } = useMovieDetails(id);
    const getImageUrl = useImageUrl();

    const { top } = useSafeAreaInsets();

    const {
        runtime,
        tagline,
        credits,
        reviews,
        recommendations,
        genres,
        accountStates,
        voteCount,
    } = data || {};

    const { favorite, rated, watchlist } = accountStates || {};

    const backdropHeight = (screenWidth * 9) / 16;

    const infos = [
        {
            key: translate("ORIGINAL_LANGUAGE"),
            value: getLanguage("en", originalLanguage),
        },
        ...(genres
            ? [
                  {
                      key: translate("GENRES"),
                      value: genres.map(genre => genre.name).join(", "),
                  },
              ]
            : []),
    ];

    const { style: parallaxStyle, scrollHandler } = useParallax(0.4);

    const handleMarkAsFavorite = () => {
        markAsFavorite("movie", id, !favorite);
    };

    const handleAddToWatchist = () => {
        addToWatchlist("movie", id, !watchlist);
    };

    const handleRate = (rating?: number) => {
        rate({
            mediaType: "movie",
            mediaId: id,
            rating: rating ? rating * 2 : undefined,
        });
    };

    return (
        <ScrollView
            contentContainerStyle={styles.movieDetails}
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
                    <DynamicSizedTitle title={title} />
                    <DotSeperatedLine>
                        {releaseDate ? (
                            <Text style={secondaryText}>
                                {formatDate(new Date(releaseDate))}
                            </Text>
                        ) : undefined}
                        {runtime ? (
                            <Text style={secondaryText}>
                                {convertMinutesToTimeString(runtime)}
                            </Text>
                        ) : undefined}
                    </DotSeperatedLine>
                    <InfoBox data={infos} />
                    {status === "loading" ? (
                        <ActivityIndicator style={styles.activityIndicator} />
                    ) : undefined}
                </View>
            </View>
            <RatingWithVoteCount
                percent={voteAverage * 10}
                voteCount={voteCount || 0}
                style={[styles.rating, { top: backdropHeight - 20 }]}
            />
            {data ? (
                <ActionsWidget
                    isFavorite={!!favorite}
                    isOnWatchlist={!!watchlist}
                    rating={(rated || 0) / 2}
                    onAddToList={() => showAccountListSelector("movie", id)}
                    onMarkAsFavorite={handleMarkAsFavorite}
                    onAddToWatchlist={handleAddToWatchist}
                    onRate={handleRate}
                />
            ) : undefined}
            {tagline ? (
                <Text style={styles.tagline}>{tagline}</Text>
            ) : undefined}

            <View style={styles.overviewWrapper}>
                <Text style={styles.overview}>{overview}</Text>
            </View>
            {credits && credits.cast.length ? (
                <MediaWidget
                    title={translate("CAST")}
                    data={credits.cast.slice(0, 10)}
                    itemWidth={TILE_WIDTH_S + TILE_HORIZONTAL_MARGIN * 2}
                    renderItem={credit => (
                        <MediaTile
                            title={credit.name}
                            subtitle={credit.character}
                            imageUrl={
                                credit.profilePath
                                    ? getImageUrl(
                                          credit.profilePath,
                                          "profile",
                                          "medium"
                                      )
                                    : undefined
                            }
                            onPress={() =>
                                navigation.navigate("PersonDetails", {
                                    id: credit.id,
                                })
                            }
                            size="small"
                            style={styles.tileMargin}
                        />
                    )}
                    keyExtractor={credit => `${credit.id}`}
                    style={styles.widget}
                />
            ) : undefined}
            {reviews && reviews.length ? (
                <ReviewsWidget reviews={reviews} style={styles.widget} />
            ) : undefined}
            {recommendations && recommendations.length ? (
                <MediaWidget
                    title={translate("RECOMMENDATIONS")}
                    data={recommendations}
                    itemWidth={TILE_WIDTH_M + TILE_HORIZONTAL_MARGIN * 2}
                    renderItem={movie => (
                        <MediaTile
                            title={movie.title}
                            subtitle={
                                movie.releaseDate
                                    ? formatDate(new Date(movie.releaseDate))
                                    : undefined
                            }
                            imageUrl={
                                movie.posterPath
                                    ? getImageUrl(
                                          movie.posterPath,
                                          "poster",
                                          "small"
                                      )
                                    : undefined
                            }
                            voteAverage={movie.voteAverage}
                            onPress={() =>
                                navigation.push("MovieDetails", { movie })
                            }
                            style={styles.tileMargin}
                        />
                    )}
                    keyExtractor={item => `${item.id}`}
                    style={styles.widget}
                />
            ) : undefined}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    movieDetails: {
        paddingBottom: 40,
    },
    backdrop: {
        width: "100%",
    },
    mainContent: {
        flexDirection: "row",
        backgroundColor: gray1,
        padding: 20,
        paddingBottom: 0,
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
    rating: { position: "absolute", right: 20 },
    overviewWrapper: {
        margin: 20,
    },
    overview: {
        color: textColorSecondary,
    },
    activityIndicator: {
        marginTop: "auto",
        marginBottom: "auto",
    },
    tagline: {
        marginTop: 10,
        color: textColorSecondary,
        fontSize: 18,
        fontWeight: "200",
        fontStyle: "italic",
        marginHorizontal: 40,
        textAlign: "center",
    },
    tileMargin: {
        marginHorizontal: TILE_HORIZONTAL_MARGIN,
        marginVertical: 10,
    },
    widget: {
        marginBottom: 20,
    },
});

export default MovieDetails;

import { useNavigation, useRoute } from "@react-navigation/native";
import { getLanguage } from "iso-countries-languages";
import React from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

import InfoBox from "../components/InfoBox";
import MediaTile from "../components/MediaTile";
import MediaWidget from "../components/MediaWidget";
import Rating from "../components/Rating";
import ReviewsWidget from "../components/ReviewsWidget";
import { gray2, textColor, textColorSecondary } from "../constants/colors";
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
import useMovieDetails from "../tmdb/useMovieDetails";
import { formatDate } from "../util/date";
import { convertMinutesToTimeString } from "../util/time";

const MovieDetails: React.FC = () => {
    const route = useRoute<StartStackRouteProp<"MovieDetails">>();
    const navigation = useNavigation<
        StartStackNavigationProp<"MovieDetails">
    >();
    const { width: screenWidth } = useWindowDimensions();

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

    const { movieDetails, loading } = useMovieDetails(id);
    const getImageUrl = useImageUrl();

    const { runtime, tagline, credits, reviews, recommendations, genres } =
        movieDetails || {};

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
                      value: genres.map((genre) => genre.name).join(", "),
                  },
              ]
            : []),
    ];

    return (
        <ScrollView contentContainerStyle={styles.movieDetails}>
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
                            title.length > 40 && styles.titleSmall,
                        ]}>
                        {title}
                    </Text>
                    <View style={styles.dateRuntimeWrapper}>
                        <Text style={secondaryText}>
                            {formatDate(new Date(releaseDate))}
                        </Text>
                        {runtime ? (
                            <>
                                <View style={dot} />
                                <Text style={secondaryText}>
                                    {convertMinutesToTimeString(runtime)}
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
                            size="small"
                            style={styles.tileMargin}
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
                    renderItem={(movie) => (
                        <MediaTile
                            title={movie.title}
                            subtitle={formatDate(new Date(movie.releaseDate))}
                            imageUrl={
                                movie.posterPath
                                    ? getImageUrl(
                                          movie.posterPath,
                                          "poster",
                                          "medium",
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
                    keyExtractor={(item) => `${item.id}`}
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
    },
    titleSmall: {
        fontSize: 20,
    },
    rating: { position: "absolute", right: 20 },
    overviewWrapper: {
        marginHorizontal: 20,
        borderTopColor: gray2,
        borderTopWidth: 1,
        paddingTop: 20,
        marginBottom: 20,
    },
    overview: {
        color: textColorSecondary,
    },
    activityIndicator: {
        marginTop: "auto",
        marginBottom: "auto",
    },
    dateRuntimeWrapper: {
        flexDirection: "row",
        marginTop: 5,
    },
    tagline: {
        marginBottom: 20,
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

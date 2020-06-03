import React from "react";
import {
    View,
    Image,
    Text,
    useWindowDimensions,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { StartStackRouteProp } from "../navigators/StartStackNavigator";
import { getPosterUrl, getBackdropUrl } from "../tmdb/util";
import {
    textColor,
    gray2,
    textColorSecondary,
    primaryColor,
} from "../constants/colors";
import { shadowStyle } from "../constants/styles";
import { formatDate } from "../util/date";
import Rating from "../components/Rating";
import useMovieDetails from "../tmdb/useMovieDetails";
import { convertMinutesToTimeString } from "../util/time";
import { getLanguage } from "iso-countries-languages";
import CreditWidget from "../components/CreditWidget";
import ReviewsWidget from "../components/ReviewsWidget";

const MovieDetails: React.FC = () => {
    const route = useRoute<StartStackRouteProp<"MovieDetails">>();
    const { width: screenWidth } = useWindowDimensions();

    const {
        movie: {
            id,
            backdropPath,
            posterPath,
            title,
            releaseDate,
            genres,
            voteAverage,
            overview,
            originalLanguage,
        },
    } = route.params;

    const { movieDetails, loading } = useMovieDetails(id);

    const { runtime, tagline, credits, reviews } = movieDetails || {};

    const backdropHeight = (screenWidth * 9) / 16;

    return (
        <ScrollView contentContainerStyle={styles.movieDetails} bounces={false}>
            {backdropPath ? (
                <Image
                    source={{ uri: getBackdropUrl(backdropPath) }}
                    style={[styles.backdrop, { height: backdropHeight }]}
                />
            ) : undefined}
            <Rating
                percent={voteAverage * 10}
                style={[styles.rating, { top: backdropHeight - 20 }]}
            />
            <View style={styles.mainContent}>
                {posterPath ? (
                    <View style={shadowStyle}>
                        <Image
                            source={{ uri: getPosterUrl(posterPath) }}
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
                        <Text style={styles.infoValue}>
                            {formatDate(new Date(releaseDate))}
                        </Text>
                        {runtime ? (
                            <>
                                <View style={styles.dot} />
                                <Text style={styles.infoValue}>
                                    {convertMinutesToTimeString(runtime)}
                                </Text>
                            </>
                        ) : undefined}
                    </View>
                    <Text style={styles.infoKey}>Original Language</Text>
                    <Text style={styles.infoValue}>
                        {getLanguage("en", originalLanguage)}
                    </Text>
                    <Text style={styles.infoKey}>Genres</Text>
                    <Text style={styles.infoValue}>
                        {genres.map((genre) => genre.name).join(", ")}
                    </Text>

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
                <CreditWidget credits={credits.cast.slice(0, 10)} />
            ) : undefined}
            {reviews && reviews.length ? (
                <ReviewsWidget reviews={reviews} />
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
    infoKey: {
        color: primaryColor,
        marginTop: 10,
        marginBottom: 2,
        fontWeight: "bold",
    },
    infoValue: {
        color: textColorSecondary,
    },
    rating: { position: "absolute", right: 20 },
    overviewWrapper: {
        marginHorizontal: 20,
        borderTopColor: gray2,
        borderTopWidth: 1,
        paddingTop: 20,
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
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginHorizontal: 8,
        marginTop: "auto",
        marginBottom: "auto",
        backgroundColor: textColorSecondary,
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
});

export default MovieDetails;

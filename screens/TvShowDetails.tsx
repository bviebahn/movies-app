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

import MediaTile from "../components/MediaTile";
import MediaWidget from "../components/MediaWidget";
import Rating from "../components/Rating";
import ReviewsWidget from "../components/ReviewsWidget";
import {
    gray2,
    primaryColor,
    textColor,
    textColorSecondary,
} from "../constants/colors";
import { dot, shadowStyle } from "../constants/styles";
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
import useTvShowDetails from "../tmdb/useTvShowDetails";
import { getBackdropUrl, getPosterUrl } from "../tmdb/util";
import { formatDate } from "../util/date";
import { convertMinutesToTimeString } from "../util/time";

const TvShowDetails: React.FC = () => {
    const route = useRoute<StartStackRouteProp<"TvShowDetails">>();
    const navigation = useNavigation<
        StartStackNavigationProp<"TvShowDetails">
    >();
    const { width: screenWidth } = useWindowDimensions();

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

    const { tvShowDetails, loading } = useTvShowDetails(id);

    const {
        credits,
        reviews,
        recommendations,
        genres,
        episodeRunTime,
        seasons,
        createdBy,
    } = tvShowDetails || {};

    const backdropHeight = (screenWidth * 9) / 16;

    return (
        <ScrollView contentContainerStyle={styles.tvShowDetails}>
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
                            name.length > 40 && styles.titleSmall,
                        ]}>
                        {name}
                    </Text>
                    <View style={styles.dateRuntimeWrapper}>
                        <Text style={styles.infoValue}>
                            {formatDate(new Date(firstAirDate))}
                        </Text>
                        {episodeRunTime ? (
                            <>
                                <View style={dot} />
                                <Text style={styles.infoValue}>
                                    {convertMinutesToTimeString(episodeRunTime)}
                                </Text>
                            </>
                        ) : undefined}
                    </View>
                    {createdBy && createdBy.length ? (
                        <>
                            <Text style={styles.infoKey}>
                                {translate("CREATOR", { n: createdBy.length })}
                            </Text>
                            <Text style={styles.infoValue}>
                                {createdBy
                                    .map((creator) => creator.name)
                                    .join(", ")}
                            </Text>
                        </>
                    ) : undefined}
                    <Text style={styles.infoKey}>
                        {translate("ORIGINAL_LANGUAGE")}
                    </Text>
                    <Text style={styles.infoValue}>
                        {getLanguage("en", originalLanguage)}
                    </Text>

                    {genres ? (
                        <>
                            <Text style={styles.infoKey}>
                                {translate("GENRES")}
                            </Text>
                            <Text style={styles.infoValue}>
                                {genres.map((genre) => genre.name).join(", ")}
                            </Text>
                        </>
                    ) : undefined}

                    {loading ? (
                        <ActivityIndicator style={styles.activityIndicator} />
                    ) : undefined}
                </View>
            </View>
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
                            posterPath={season.posterPath}
                            onPress={() => undefined}
                            style={styles.tileMargin}
                        />
                    )}
                    keyExtractor={(item) => `${item.id}`}
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
                            posterPath={credit.profilePath}
                            onPress={() => undefined}
                            style={styles.tileMargin}
                            size="small"
                        />
                    )}
                    keyExtractor={(credit) => `${credit.id}`}
                />
            ) : undefined}
            {reviews && reviews.length ? (
                <ReviewsWidget reviews={reviews} />
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
                            posterPath={tvShow.posterPath}
                            voteAverage={tvShow.voteAverage}
                            onPress={() =>
                                navigation.push("TvShowDetails", { tvShow })
                            }
                            style={styles.tileMargin}
                        />
                    )}
                    keyExtractor={(item) => `${item.id}`}
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
    tileMargin: {
        marginHorizontal: TILE_HORIZONTAL_MARGIN,
        marginVertical: 10,
    },
    dateRuntimeWrapper: {
        flexDirection: "row",
        marginTop: 5,
    },
});

export default TvShowDetails;

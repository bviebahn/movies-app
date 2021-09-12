import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MediaTile from "../components/MediaTile";
import MediaWidget from "../components/MediaWidget";
import { TILE_HORIZONTAL_MARGIN, TILE_WIDTH_M } from "../constants/values";
import translate from "../i18/Locale";
import { StartStackNavigationProp } from "../navigators/StartStackNavigator";
import useImageUrl from "../tmdb/useImageUrl";
import useMovies from "../tmdb/useMovies";
import useTvShows from "../tmdb/useTvShows";
import { formatDate } from "../util/date";

const Home: React.FC = () => {
    const { data: popularMovies } = useMovies("popular");
    const { data: popularTvShows } = useTvShows("popular");
    const navigation = useNavigation<StartStackNavigationProp<"Home">>();
    const getImageUrl = useImageUrl();

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <MediaWidget
                    title={translate("POPULAR_MOVIES")}
                    data={popularMovies}
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
                            style={styles.mediaTile}
                        />
                    )}
                    keyExtractor={item => `${item.id}`}
                    style={styles.widget}
                />
                <MediaWidget
                    title={translate("POPULAR_TV_SHOWS")}
                    data={popularTvShows}
                    itemWidth={TILE_WIDTH_M + TILE_HORIZONTAL_MARGIN * 2}
                    renderItem={tvShow => (
                        <MediaTile
                            title={tvShow.name}
                            subtitle={
                                tvShow.firstAirDate
                                    ? formatDate(new Date(tvShow.firstAirDate))
                                    : undefined
                            }
                            imageUrl={
                                tvShow.posterPath
                                    ? getImageUrl(
                                          tvShow.posterPath,
                                          "poster",
                                          "small"
                                      )
                                    : undefined
                            }
                            voteAverage={tvShow.voteAverage}
                            onPress={() =>
                                navigation.push("TvShowDetails", { tvShow })
                            }
                            style={styles.mediaTile}
                        />
                    )}
                    keyExtractor={item => `${item.id}`}
                    style={styles.widget}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollViewContainer: {
        paddingBottom: 40,
    },
    mediaTile: {
        marginHorizontal: TILE_HORIZONTAL_MARGIN,
        marginVertical: 10,
    },
    widget: {
        marginTop: 30,
    },
});

export default Home;

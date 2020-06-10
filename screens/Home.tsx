import React from "react";
import useMovies from "../tmdb/useMovies";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import translate from "../i18/Locale";
import MediaTile from "../components/MediaTile";
import { useNavigation } from "@react-navigation/native";
import { StartStackNavigationProp } from "../navigators/StartStackNavigator";
import { formatDate } from "../util/date";
import MediaWidget from "../components/MediaWidget";
import useTvShows from "../tmdb/useTvShows";
import { TILE_HORIZONTAL_MARGIN, TILE_WIDTH_M } from "../constants/values";
import useImageUrl from "../tmdb/useImageUrl";

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
                            style={styles.mediaTile}
                        />
                    )}
                    keyExtractor={(item) => `${item.id}`}
                    style={styles.widget}
                />
                <MediaWidget
                    title={translate("POPULAR_TV_SHOWS")}
                    data={popularTvShows}
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
                            style={styles.mediaTile}
                        />
                    )}
                    keyExtractor={(item) => `${item.id}`}
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

import React from "react";
import useMovies from "../tmdb/useMovies";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import translate from "../i18/Locale";
import MediaTile, { TOTAL_TILE_WIDTH } from "../components/MediaTile";
import { useNavigation } from "@react-navigation/native";
import { StartStackNavigationProp } from "../navigators/StartStackNavigator";
import { formatDate } from "../util/date";
import MediaWidget from "../components/MediaWidget";
import useTvShows from "../tmdb/useTvShows";

const Home: React.FC = () => {
    const { data: popularMovies } = useMovies("popular");
    const { data: popularTvShows } = useTvShows("popular");
    const navigation = useNavigation<StartStackNavigationProp<"Home">>();

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <MediaWidget
                    title={translate("POPULAR_MOVIES")}
                    data={popularMovies}
                    itemWidth={TOTAL_TILE_WIDTH}
                    renderItem={(movie) => (
                        <MediaTile
                            title={movie.title}
                            subtitle={formatDate(new Date(movie.releaseDate))}
                            posterPath={movie.posterPath}
                            voteAverage={movie.voteAverage}
                            onPress={() =>
                                navigation.push("MovieDetails", { movie })
                            }
                        />
                    )}
                    keyExtractor={(item) => `${item.id}`}
                />
                <MediaWidget
                    title={translate("POPULAR_TV_SHOWS")}
                    data={popularTvShows}
                    itemWidth={TOTAL_TILE_WIDTH}
                    renderItem={(tvShow) => (
                        <MediaTile
                            title={tvShow.name}
                            subtitle={formatDate(new Date(tvShow.firstAirDate))}
                            posterPath={tvShow.posterPath}
                            voteAverage={tvShow.voteAverage}
                            onPress={() => undefined}
                        />
                    )}
                    keyExtractor={(item) => `${item.id}`}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollViewContainer: {
        paddingBottom: 40,
    },
});

export default Home;

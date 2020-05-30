import React from "react";
import { Movie } from "../tmdb/types";
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    useWindowDimensions,
    ViewStyle,
    StyleProp,
    TouchableOpacity,
} from "react-native";
import { gray2, gray3, textColor, gray4 } from "../constants/colors";
import { getImageUrl } from "../tmdb/util";
import { shadowStyle } from "../constants/styles";
import { formatDate } from "../util/date";

type Props = {
    title: string;
    movies: ReadonlyArray<Movie>;
};

type ElementProps = {
    movie: Movie;
    style?: StyleProp<ViewStyle>;
};

const MovieElement: React.FC<ElementProps> = ({ movie, style }) => {
    const { posterPath, title, releaseDate, genres } = movie;

    return (
        <TouchableOpacity style={[styles.movieElement, shadowStyle, style]}>
            {posterPath ? (
                <Image
                    source={{ uri: getImageUrl(posterPath) }}
                    style={styles.image}
                />
            ) : undefined}
            <View style={styles.infoContainer}>
                <Text numberOfLines={2} style={styles.movieTitle}>
                    {title}
                </Text>
                <Text style={styles.releaseDate}>
                    {formatDate(releaseDate)}
                </Text>
                <Text style={styles.genre}>
                    {genres.map((genre) => genre.name).join(", ")}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const MovieWidget: React.FC<Props> = ({ movies, title }) => {
    const { width } = useWindowDimensions();
    const elementWidth = width - 80;
    return (
        <>
            <Text style={styles.title}>{title}</Text>
            <FlatList
                horizontal
                data={movies}
                renderItem={({ item }) => (
                    <MovieElement
                        movie={item}
                        style={{ width: elementWidth }}
                    />
                )}
                keyExtractor={(item) => `${item.id}`}
                pagingEnabled
                snapToInterval={elementWidth + 20}
                snapToAlignment="center"
                decelerationRate="fast"
                initialNumToRender={3}
                showsHorizontalScrollIndicator={false}
            />
        </>
    );
};

const styles = StyleSheet.create({
    title: {
        color: "#fff",
        fontSize: 26,
        margin: 20,
        marginBottom: 0,
    },
    movieElement: {
        flexDirection: "row",
        backgroundColor: gray2,
        margin: 10,
        height: 180,
        borderRadius: 8,
    },
    movieTitle: {
        color: textColor,
        fontSize: 22,
        fontWeight: "bold",
    },
    image: {
        height: 180,
        width: 120,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
    infoContainer: {
        flex: 1,
        margin: 10,
    },
    releaseDate: {
        color: gray3,
        marginTop: 5,
    },
    genre: {
        color: gray4,
        fontWeight: "200",
        marginTop: 5,
    },
});

export default MovieWidget;

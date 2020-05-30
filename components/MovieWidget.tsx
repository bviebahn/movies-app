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

const elementWidth = 160;
const elementHorizontalMargin = 10;

const MovieElement: React.FC<ElementProps> = ({ movie, style }) => {
    const { posterPath, title, releaseDate } = movie;

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
            </View>
        </TouchableOpacity>
    );
};

const MovieWidget: React.FC<Props> = ({ movies, title }) => {
    const { width: screenWidth } = useWindowDimensions();
    const elementsPerInterval = Math.floor(
        screenWidth / (elementWidth + elementHorizontalMargin * 2),
    );

    const snapOffsets = [...Array(movies.length - 1)].reduce(
        (prev, _, index) => {
            return [
                ...prev,
                prev[index] + elementsPerInterval * (elementWidth + 20),
            ];
        },
        [0],
    );

    return (
        <>
            <Text style={styles.title}>{title}</Text>
            <FlatList
                horizontal
                data={movies}
                renderItem={({ item }) => <MovieElement movie={item} />}
                keyExtractor={(item) => `${item.id}`}
                pagingEnabled
                snapToOffsets={snapOffsets}
                decelerationRate="fast"
                initialNumToRender={(elementsPerInterval + 1) * 2}
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
        backgroundColor: gray2,
        marginHorizontal: elementHorizontalMargin,
        marginVertical: 10,
        height: 350,
        width: elementWidth,
        borderRadius: 8,
    },
    movieTitle: {
        color: textColor,
        fontSize: 18,
        fontWeight: "bold",
    },
    image: {
        height: 240,
        width: elementWidth,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
    },
    infoContainer: {
        flex: 1,
        margin: 10,
    },
    releaseDate: {
        color: gray3,
        marginTop: 5,
    },
});

export default MovieWidget;

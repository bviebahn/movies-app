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
import { gray2, gray3, textColor } from "../constants/colors";
import { getPosterUrl } from "../tmdb/util";
import { shadowStyle } from "../constants/styles";
import { formatDate } from "../util/date";
import Rating from "./Rating";
import { useNavigation } from "@react-navigation/native";
import { StartStackNavigationProp } from "../navigators/StartStackNavigator";

type NavigationProp = StartStackNavigationProp<"Home">;

type Props = {
    title: string;
    movies: ReadonlyArray<Movie>;
};

type ElementProps = {
    movie: Movie;
    navigation: NavigationProp;
    style?: StyleProp<ViewStyle>;
};

const elementWidth = 160;
const elementHorizontalMargin = 10;

const MovieElement: React.FC<ElementProps> = ({ movie, navigation, style }) => {
    const { posterPath, title, releaseDate, voteAverage } = movie;

    return (
        <TouchableOpacity
            onPress={() => navigation.push("MovieDetails", { movie })}
            style={[styles.movieElement, shadowStyle, style]}>
            {posterPath ? (
                <Image
                    source={{ uri: getPosterUrl(posterPath) }}
                    style={styles.image}
                />
            ) : undefined}
            <Rating percent={voteAverage * 10} style={styles.rating} />
            <View style={styles.infoContainer}>
                <Text numberOfLines={2} style={styles.movieTitle}>
                    {title}
                </Text>
                <Text style={styles.releaseDate}>
                    {formatDate(new Date(releaseDate))}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const MovieWidget: React.FC<Props> = ({ movies, title }) => {
    const { width: screenWidth } = useWindowDimensions();
    const navigation = useNavigation<NavigationProp>();

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
                renderItem={({ item }) => (
                    <MovieElement movie={item} navigation={navigation} />
                )}
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
        color: textColor,
        fontSize: 26,
        margin: 20,
        marginBottom: 0,
    },
    movieElement: {
        backgroundColor: gray2,
        marginHorizontal: elementHorizontalMargin,
        marginVertical: 10,
        height: 340,
        width: elementWidth,
        borderRadius: 8,
    },
    movieTitle: {
        color: textColor,
        fontSize: 16,
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
        marginTop: 25,
    },
    releaseDate: {
        color: gray3,
        marginTop: 5,
    },
    rating: { position: "absolute", top: 220, right: 10 },
});

export default MovieWidget;

import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Easing,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from "react-native";
import SearchBar from "react-native-search-bar";

import { gray0, gray3, textColorSecondary } from "../constants/colors";
import { shadowStyle } from "../constants/styles";
import translate from "../i18/Locale";
import useImageUrl from "../tmdb/useImageUrl";
import useSearch, { SearchResultItem } from "../tmdb/useSearch";
import { formatDate } from "../util/date";
import useDebounce, { useDebouncedValue } from "../util/useDebounce";
import Rating from "../components/Rating";
import { useNavigation } from "@react-navigation/native";
import { SearchStackNavigationProp } from "../navigators/SearchStackNavigator";
import useGenres from "../tmdb/useGenres";
import ChipSelector from "../components/ChipSelector";

const SearchListItem: React.FC<{ item: SearchResultItem }> = ({ item }) => {
    const title = item.mediaType === "movie" ? item.title : item.name;

    const navigation = useNavigation<SearchStackNavigationProp<"Search">>();

    const getImageUrl = useImageUrl();
    const imagePath =
        item.mediaType === "person" ? item.profilePath : item.posterPath;
    const imageType = item.mediaType === "person" ? "profile" : "poster";
    const imageSize = item.mediaType === "person" ? "medium" : "small";

    const releaseDate = (() => {
        if (item.mediaType === "person") {
            return undefined;
        }
        return item.mediaType === "movie"
            ? item.releaseDate
            : item.firstAirDate;
    })();

    const overview = item.mediaType === "person" ? undefined : item.overview;
    const voteAverage =
        item.mediaType === "person" ? undefined : item.voteAverage;

    const handlePress = () => {
        if (item.mediaType === "movie") {
            navigation.push("MovieDetails", { movie: item });
        } else if (item.mediaType === "tv") {
            navigation.push("TvShowDetails", { tvShow: item });
        }
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.searchListItem}>
            {imagePath ? (
                <View style={shadowStyle}>
                    <Image
                        source={{
                            uri: getImageUrl(imagePath, imageType, imageSize),
                        }}
                        style={styles.itemImage}
                    />
                </View>
            ) : undefined}
            <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{title}</Text>
                {releaseDate ? (
                    <Text style={styles.itemDate}>
                        {formatDate(new Date(releaseDate))}
                    </Text>
                ) : undefined}
                {overview ? (
                    <Text style={styles.itemOverview} numberOfLines={5}>
                        {overview}
                    </Text>
                ) : undefined}
            </View>
            {voteAverage ? (
                <Rating percent={voteAverage * 10} style={styles.rating} />
            ) : undefined}
        </TouchableOpacity>
    );
};

const Search: React.FC = () => {
    const [screenTitleHidden, setScreenTitleHidden] = useState(false);
    const [query, setQuery] = useState<string>();
    const anim = useRef(new Animated.Value(1));
    const [scrollOffset, setScrollOffset] = useState(0);

    const debouncedQuery = useDebouncedValue(query, 500);
    const { data, loading, fetchMore } = useSearch(debouncedQuery);

    const fetchMoreDebounced = useDebounce(fetchMore, 1000);

    const { movieGenres, tvGenres } = useGenres();

    useEffect(() => {
        if (screenTitleHidden) {
            Animated.timing(anim.current, {
                toValue: 0,
                duration: 300,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(anim.current, {
                toValue: 1,
                duration: 300,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
        }
    }, [screenTitleHidden]);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const newScrollOffset = event.nativeEvent.contentOffset.y;
        const diff = Math.abs(scrollOffset - newScrollOffset);
        if (diff > 100) {
            setScreenTitleHidden(newScrollOffset > scrollOffset);
            setScrollOffset(newScrollOffset);
        }
    };

    return (
        <SafeAreaView style={styles.search}>
            <Animated.View
                style={[
                    styles.animatedWrapper,
                    {
                        transform: [
                            {
                                translateY: anim.current.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-50, 0],
                                }),
                            },
                        ],
                    },
                ]}>
                <View style={styles.searchBarWrapper}>
                    <Animated.Text
                        style={[
                            styles.screenTitle,
                            {
                                opacity: anim.current,
                            },
                        ]}>
                        {translate("SEARCH")}
                    </Animated.Text>
                    <SearchBar
                        text={query}
                        barStyle="black"
                        hideBackground
                        textColor={textColorSecondary}
                        keyboardAppearance="dark"
                        onChangeText={setQuery}
                        onFocus={() => setScreenTitleHidden(true)}
                    />
                </View>
                {data ? (
                    <FlatList
                        data={data.results}
                        renderItem={({ item }) => (
                            <SearchListItem item={item} />
                        )}
                        keyExtractor={(item) => `${item.mediaType}:${item.id}`}
                        onEndReached={fetchMoreDebounced}
                        ListFooterComponent={<ActivityIndicator />}
                        ListFooterComponentStyle={styles.listFooter}
                        keyboardShouldPersistTaps="never"
                        keyboardDismissMode="on-drag"
                        onScroll={handleScroll}
                    />
                ) : (
                    <>
                        <Text style={styles.genresTitle}>
                            {translate("MOVIE_GENRES")}
                        </Text>
                        <ChipSelector
                            data={movieGenres.map((genre) => genre.name)}
                            onPressItem={() => undefined}
                        />
                        <Text style={styles.genresTitle}>
                            {translate("TV_GENRES")}
                        </Text>
                        <ChipSelector
                            data={tvGenres.map((genre) => genre.name)}
                            onPressItem={() => undefined}
                        />
                    </>
                )}
                {loading && !data ? (
                    <ActivityIndicator style={styles.activityIndicator} />
                ) : undefined}
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    search: {
        flex: 1,
    },
    searchBarWrapper: { margin: 20, marginBottom: 10 },
    animatedWrapper: { paddingBottom: 80 },
    screenTitle: {
        color: textColorSecondary,
        fontSize: 32,
        fontWeight: "bold",
    },
    activityIndicator: {
        marginTop: "auto",
        marginBottom: "auto",
    },
    searchListItem: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: gray0,
        borderBottomColor: "#000",
        borderBottomWidth: 1,
        padding: 10,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: textColorSecondary,
        marginBottom: 4,
    },
    itemInfo: { marginHorizontal: 10, flexShrink: 1 },
    itemImage: { width: 80, height: 120, borderRadius: 4 },
    itemOverview: {
        color: textColorSecondary,
    },
    itemDate: {
        color: gray3,
        marginBottom: 4,
    },
    listFooter: {
        marginVertical: 20,
    },
    rating: { marginLeft: "auto" },
    genresTitle: {
        color: textColorSecondary,
        marginLeft: 20,
        marginBottom: 10,
        marginTop: 20,
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default Search;

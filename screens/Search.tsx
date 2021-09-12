import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Easing,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StyleSheet,
    Text,
    View,
} from "react-native";
import SearchBar from "react-native-platform-searchbar";
import { SafeAreaView } from "react-native-safe-area-context";
import ChipSelector from "../components/ChipSelector";
import MediaList from "../components/MediaList";
import { textColorSecondary } from "../constants/colors";
import translate from "../i18/Locale";
import { SearchStackNavigationProp } from "../navigators/SearchStackNavigator";
import { SearchResult } from "../tmdb/types";
import useGenres from "../tmdb/useGenres";
import useSearch from "../tmdb/useSearch";
import useDebounce, { useDebouncedValue } from "../util/useDebounce";

const SearchResults: React.FC<{
    query: string;
    handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    navigation: SearchStackNavigationProp<"Search">;
}> = ({ query, handleScroll, navigation }) => {
    const { data, fetchNextPage, hasNextPage, isFetching } = useSearch(query);
    const fetchMoreDebounced = useDebounce(fetchNextPage, 1000);

    const results = useMemo(
        () =>
            (data?.pages || []).reduce(
                (prev, curr) => [...prev, ...curr.results],
                [] as SearchResult["results"]
            ),
        [data]
    );

    return data ? (
        <MediaList
            data={results}
            onPressItem={item => {
                if (item.mediaType === "movie") {
                    navigation.push("MovieDetails", { movie: item });
                } else if (item.mediaType === "tv") {
                    navigation.push("TvShowDetails", { tvShow: item });
                } else {
                    navigation.push("PersonDetails", { id: item.id });
                }
            }}
            onEndReached={() => hasNextPage && fetchMoreDebounced()}
            ListFooterComponent={isFetching ? <ActivityIndicator /> : undefined}
            ListFooterComponentStyle={styles.listFooter}
            onScroll={handleScroll}
        />
    ) : null;
};

const Search: React.FC = () => {
    const navigation = useNavigation<SearchStackNavigationProp<"Search">>();
    const [screenTitleHidden, setScreenTitleHidden] = useState(false);
    const [query, setQuery] = useState<string>("");
    const anim = useRef(new Animated.Value(1));
    const scrollOffset = useRef(0);

    const debouncedQuery = useDebouncedValue(query, 500);

    const { data: movieGenres } = useGenres("movie");
    const { data: tvGenres } = useGenres("tv");

    useEffect(() => {
        const animation = Animated.timing(anim.current, {
            toValue: screenTitleHidden ? 0 : 1,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
        });
        animation.start();
        return animation.stop;
    }, [screenTitleHidden]);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const newScrollOffset = event.nativeEvent.contentOffset.y;
        const diff = Math.abs(scrollOffset.current - newScrollOffset);
        if (diff > 100) {
            setScreenTitleHidden(newScrollOffset > scrollOffset.current);
            scrollOffset.current = newScrollOffset;
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
                        value={query}
                        onChangeText={setQuery}
                        theme="dark"
                        keyboardAppearance="dark"
                        placeholder={translate("SEARCH")}
                        onCancel={() => setScreenTitleHidden(false)}
                        onFocus={() => setScreenTitleHidden(true)}
                    />
                </View>
                {debouncedQuery ? (
                    <SearchResults
                        navigation={navigation}
                        query={debouncedQuery}
                        handleScroll={handleScroll}
                    />
                ) : (
                    <>
                        <Text style={styles.genresTitle}>
                            {translate("MOVIE_GENRES")}
                        </Text>
                        <ChipSelector
                            data={(movieGenres || []).map(genre => genre.name)}
                            onPressItem={() => undefined}
                        />
                        <Text style={styles.genresTitle}>
                            {translate("TV_GENRES")}
                        </Text>
                        <ChipSelector
                            data={(tvGenres || []).map(genre => genre.name)}
                            onPressItem={() => undefined}
                        />
                    </>
                )}
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
        marginBottom: 10,
    },
    activityIndicator: {
        marginTop: "auto",
        marginBottom: "auto",
    },
    listFooter: {
        marginVertical: 20,
    },
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

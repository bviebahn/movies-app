import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import MediaList from "../components/MediaList";
import {
    favoriteRed,
    favoriteRedDark,
    ratedYellow,
    ratedYellowDark,
    recommendationsColor,
    recommendationsColorDark,
    textColor,
    textColorSecondary,
    watchlistGreen,
    watchlistGreenDark,
} from "../constants/colors";
import translate from "../i18/Locale";
import {
    ProfileStackNavigationProp,
    ProfileStackRouteProp,
} from "../navigators/ProfileStackNavigator";
import { Movie, TvShow } from "../tmdb/types";
import useAccountList, { AccountListType } from "../tmdb/useAccountList";

type ListProps = {
    route: {
        type: AccountListType;
        mediaType: "movie" | "tv";
        navigation: ProfileStackNavigationProp<"AccountList">;
    };
};

const List: React.FC<ListProps> = ({ route }) => {
    const { type, mediaType, navigation } = route;
    const {
        data,
        status,
        fetchNextPage,
        hasNextPage,
        isFetching,
    } = useAccountList(type, mediaType);

    const lists = useMemo(
        () =>
            (data?.pages || []).reduce(
                (prev: any, curr) => [...prev, ...curr.results],
                [] as (Movie | TvShow)[]
            ),
        [data]
    );

    return status === "loading" ? (
        <ActivityIndicator style={styles.activityIndicator} />
    ) : (
        <MediaList<Movie | TvShow>
            data={lists}
            onPressItem={item => {
                if (item.mediaType === "movie") {
                    navigation.push("MovieDetails", { movie: item });
                } else {
                    navigation.push("TvShowDetails", { tvShow: item });
                }
            }}
            onEndReached={() => hasNextPage && fetchNextPage()}
            ListFooterComponent={isFetching ? <ActivityIndicator /> : undefined}
            ListFooterComponentStyle={styles.listFooter}
        />
    );
};

const AccountList: React.FC = () => {
    const route = useRoute<ProfileStackRouteProp<"AccountList">>();
    const navigation = useNavigation<
        ProfileStackNavigationProp<"AccountList">
    >();
    const { type } = route.params;

    const [lightColor, darkColor] = (() => {
        switch (type) {
            case "favorites":
                return [favoriteRed, favoriteRedDark];
            case "rated":
                return [ratedYellow, ratedYellowDark];
            case "watchlist":
                return [watchlistGreen, watchlistGreenDark];
            case "recommendations":
                return [recommendationsColor, recommendationsColorDark];
        }
    })();

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        {
            key: "movie",
            title: translate("MOVIES"),
            type,
            mediaType: "movie",
            navigation,
        },
        {
            key: "tv",
            title: translate("TV_SHOWS"),
            type,
            mediaType: "tv",
            navigation,
        },
    ]);

    const renderScene = SceneMap({
        movie: List,
        tv: List,
    });

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={props => (
                <TabBar
                    {...props}
                    tabStyle={[styles.tab, { backgroundColor: darkColor }]}
                    style={{ backgroundColor: darkColor }}
                    indicatorStyle={{ backgroundColor: lightColor }}
                    renderLabel={({ route: tabRoute, focused }) => (
                        <Text
                            style={[
                                styles.tabTitle,
                                focused && styles.tabTitleFocused,
                            ]}>
                            {tabRoute.title}
                        </Text>
                    )}
                />
            )}
        />
    );
};

const styles = StyleSheet.create({
    tabTitle: {
        color: textColorSecondary,
        padding: 10,
        fontWeight: "bold",
    },
    tabTitleFocused: { color: textColor },
    activityIndicator: {
        marginTop: "auto",
        marginBottom: "auto",
    },
    tab: {
        marginBottom: 2,
    },
    listFooter: {
        marginVertical: 20,
    },
});

export default AccountList;

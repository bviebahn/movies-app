import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

import MediaList from "../components/MediaList";
import translate from "../i18/Locale";
import {
    ProfileStackNavigationProp,
    ProfileStackRouteProp,
} from "../navigators/ProfileStackNavigator";
import useAccountList, { AccountListType } from "../tmdb/useAccountList";
import {
    favoriteRedDark,
    ratedYellowDark,
    watchlistGreenDark,
    recommendationsColorDark,
    textColorSecondary,
    favoriteRed,
    ratedYellow,
    watchlistGreen,
    recommendationsColor,
    textColor,
} from "../constants/colors";
import { Text, StyleSheet, ActivityIndicator } from "react-native";
import { Movie, TvShow } from "../tmdb/types";

type ListProps = {
    route: {
        type: AccountListType;
        mediaType: "movie" | "tv";
        navigation: ProfileStackNavigationProp<"AccountList">;
    };
};

const List: React.FC<ListProps> = ({ route }) => {
    const { type, mediaType, navigation } = route;
    const { data, status, fetchMore, isFetchingMore } = useAccountList(
        type,
        mediaType,
    );

    return status === "loading" ? (
        <ActivityIndicator style={styles.activityIndicator} />
    ) : (
        <MediaList<Movie | TvShow>
            data={data.reduce(
                (prev: any, curr) => [...prev, ...curr.results],
                [],
            )}
            onPressItem={(item) => {
                if (item.mediaType === "movie") {
                    navigation.push("MovieDetails", { movie: item });
                } else {
                    navigation.push("TvShowDetails", { tvShow: item });
                }
            }}
            onEndReached={() => fetchMore()}
            ListFooterComponent={
                isFetchingMore ? <ActivityIndicator /> : undefined
            }
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
            renderTabBar={(props) => (
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

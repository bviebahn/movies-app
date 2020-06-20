import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { SafeAreaView } from "react-native";

import MediaList from "../components/MediaList";
import {
    ProfileStackNavigationProp,
    ProfileStackRouteProp,
} from "../navigators/ProfileStackNavigator";
import useAccountList from "../tmdb/useAccountList";

const AccountList: React.FC = () => {
    const route = useRoute<ProfileStackRouteProp<"AccountList">>();
    const navigation = useNavigation<
        ProfileStackNavigationProp<"AccountList">
    >();

    const { mediaType, type } = route.params;
    const { data } = useAccountList(type, mediaType);

    return (
        <SafeAreaView>
            <MediaList
                data={data?.results}
                onPressItem={(item) => {
                    if (item.mediaType === "movie") {
                        navigation.push("MovieDetails", { movie: item });
                    } else {
                        navigation.push("TvShowDetails", { tvShow: item });
                    }
                }}
            />
        </SafeAreaView>
    );
};

export default AccountList;

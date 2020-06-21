import React from "react";
import { useRoute } from "@react-navigation/native";
import { ProfileStackRouteProp } from "../navigators/ProfileStackNavigator";
import WebView from "react-native-webview";

const Authenticate: React.FC = () => {
    const route = useRoute<ProfileStackRouteProp<"Authenticate">>();

    return (
        <WebView
            source={{
                uri: `https://www.themoviedb.org/auth/access?request_token=${route.params.requestToken}`,
            }}
        />
    );
};

export default Authenticate;

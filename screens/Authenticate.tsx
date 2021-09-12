import { useRoute } from "@react-navigation/native";
import React from "react";
import WebView from "react-native-webview";
import { ProfileStackRouteProp } from "../navigators/ProfileStackNavigator";

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

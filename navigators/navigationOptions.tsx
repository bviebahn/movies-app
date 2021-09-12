import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import React from "react";
import CloseButton from "../components/CloseButton";
import HeaderTitleWithIcon from "../components/HeaderTitleWithIcon";
import {
    favoriteRed,
    favoriteRedDark,
    ratedYellow,
    ratedYellowDark,
    recommendationsColor,
    recommendationsColorDark,
    watchlistGreen,
    watchlistGreenDark,
} from "../constants/colors";
import translate from "../i18/Locale";
import { ProfileStackRouteProp } from "./ProfileStackNavigator";

export const cardNavigationOptions: (props: {
    navigation: any;
}) => NativeStackNavigationOptions = props => {
    return {
        presentation: "containedModal",
        headerTransparent: true,
        title: "",
        headerRight: () => <CloseButton onPress={props.navigation.goBack} />,
    };
};

export function accountListNavigationOptions(props: {
    route: ProfileStackRouteProp<"AccountList">;
}): object {
    const { type } = props.route.params;
    const [title, iconName, iconColor, headerBackground] = (() => {
        switch (type) {
            case "favorites":
                return [
                    translate("FAVORITES"),
                    "heart",
                    favoriteRed,
                    favoriteRedDark,
                ];
            case "watchlist":
                return [
                    translate("WATCHLIST"),
                    "bookmark",
                    watchlistGreen,
                    watchlistGreenDark,
                ];
            case "rated":
                return [
                    translate("RATED"),
                    "star",
                    ratedYellow,
                    ratedYellowDark,
                ];
            case "recommendations":
                return [
                    translate("RECOMMENDATIONS"),
                    "thumbs-up",
                    recommendationsColor,
                    recommendationsColorDark,
                ];
        }
    })();

    return {
        headerTransparent: false,
        headerTitle: () => (
            <HeaderTitleWithIcon
                title={title}
                iconName={iconName}
                iconColor={iconColor}
            />
        ),
        headerTintColor: iconColor,
        headerStyle: {
            backgroundColor: headerBackground,
            elevation: 0,
            shadowColor: "transparent",
        },
    };
}

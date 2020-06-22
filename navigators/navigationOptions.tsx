import React from "react";
import { TransitionPresets } from "@react-navigation/stack";
import CloseButton from "../components/CloseButton";
import { RouteProp, ParamListBase } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import HeaderTitleWithIcon from "../components/HeaderTitleWithIcon";
import {
    ratedYellow,
    ratedYellowDark,
    watchlistGreen,
    watchlistGreenDark,
    favoriteRed,
    favoriteRedDark,
    recommendationsColor,
    recommendationsColorDark,
} from "../constants/colors";
import { ProfileStackRouteProp } from "./ProfileStackNavigator";
import translate from "../i18/Locale";

export function cardNavigationOptions<
    ParamList extends ParamListBase,
    RouteName extends keyof ParamList
>(props: { route: RouteProp<ParamList, RouteName>; navigation: any }): object {
    return {
        ...TransitionPresets.ModalTransition,
        headerBackImage: () => null,
        headerRight: () => (
            <CloseButton
                onPress={props.navigation.goBack}
                style={styles.closeButton}
            />
        ),
    };
}

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

const styles = StyleSheet.create({ closeButton: { marginRight: 20 } });

import { ParamListBase, RouteProp } from "@react-navigation/native";
import { TransitionPresets } from "@react-navigation/stack";
import React from "react";
import { StyleSheet } from "react-native";
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

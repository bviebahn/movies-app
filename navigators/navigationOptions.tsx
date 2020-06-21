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
    const { mediaType, type } = props.route.params;
    const title = translate("ACCOUNT_LIST_TITLE", { type, mediaType });
    const [iconName, iconColor, headerBackground] = (() => {
        switch (type) {
            case "favorites":
                return ["heart", favoriteRed, favoriteRedDark];
            case "watchlist":
                return ["bookmark", watchlistGreen, watchlistGreenDark];
            case "rated":
                return ["star", ratedYellow, ratedYellowDark];
            case "recommendations":
                return [
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
        headerStyle: { backgroundColor: headerBackground },
        headerTintColor: iconColor,
    };
}

const styles = StyleSheet.create({ closeButton: { marginRight: 20 } });

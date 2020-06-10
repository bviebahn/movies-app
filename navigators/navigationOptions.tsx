import React from "react";
import { TransitionPresets } from "@react-navigation/stack";
import CloseButton from "../components/CloseButton";
import { RouteProp, ParamListBase } from "@react-navigation/native";
import { StyleSheet } from "react-native";

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

const styles = StyleSheet.create({ closeButton: { marginRight: 20 } });

import { textColor, textColorSecondary } from "./colors";
import { StyleProp, TextStyle, ViewStyle } from "react-native";

export const shadowStyle: StyleProp<ViewStyle> = {
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,

    elevation: 2,
};

export const headline: StyleProp<TextStyle> = {
    color: textColor,
    fontSize: 26,
    fontWeight: "bold",
};

export const headline2: StyleProp<TextStyle> = {
    color: textColor,
    fontSize: 22,
    fontWeight: "bold",
};

export const secondaryText: StyleProp<TextStyle> = {
    color: textColorSecondary,
};

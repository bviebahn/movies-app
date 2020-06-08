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

    elevation: 5,
};

export const headline: StyleProp<TextStyle> = {
    color: textColor,
    fontSize: 26,
    fontWeight: "bold",
    margin: 20,
    marginBottom: 0,
};

export const dot: StyleProp<ViewStyle> = {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 8,
    marginTop: "auto",
    marginBottom: "auto",
    backgroundColor: textColorSecondary,
};

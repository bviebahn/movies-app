import React from "react";
import { BlurView, VibrancyView } from "@react-native-community/blur";
import { Platform, StyleProp, ViewStyle } from "react-native";

const Blur: React.FC<{
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}> = ({ children, style }) => {
    return Platform.OS === "android" ? (
        <BlurView style={style}>{children}</BlurView>
    ) : (
        <VibrancyView blurType="dark" style={style}>
            {children}
        </VibrancyView>
    );
};

export default Blur;

import { BlurView, VibrancyView } from "@react-native-community/blur";
import React from "react";
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

const Blur: React.FC<{
    style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
    // TODO: BlurView doesn't work great on android. Maybe don't use
    return Platform.OS === "android" ? (
        <View style={[styles.androidWrapper, style]}>
            <BlurView
                overlayColor={"transparent"}
                blurType="dark"
                blurAmount={16}
                style={styles.blurAndroid}
            />
        </View>
    ) : (
        <VibrancyView blurType="dark" style={[styles.blurIos, style]} />
    );
};

const styles = StyleSheet.create({
    blurIos: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    androidWrapper: {
        overflow: "hidden",
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    blurAndroid: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: "#222222AA",
    },
});

export default Blur;

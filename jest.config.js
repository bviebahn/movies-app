module.exports = {
    preset: "react-native",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    timers: "legacy",
    transformIgnorePatterns: [
        "node_modules/(?!(react-native" +
            "|@react-native" +
            "|react-navigation-tabs" +
            "|react-native-modal" +
            "|react-native-animatable" +
            "|react-native-screens" +
            "|react-native-reanimated" +
            "|react-native-vector-icons" +
            "|@react-native-community/blur" +
            ")/)",
    ],
};

import React from "react";
import {
    TouchableOpacity,
    StyleSheet,
    StyleProp,
    ViewStyle,
} from "react-native";
import Svg, { Path } from "react-native-svg";

const CloseButton: React.FC<{
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
}> = ({ onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={[styles.closeButton, style]}>
        <Svg width={24} height={24}>
            <Path
                fill="#333"
                d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
            />
        </Svg>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    closeButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#ffffffd0",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default CloseButton;

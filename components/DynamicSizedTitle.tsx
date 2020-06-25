import React from "react";
import { Text, StyleSheet } from "react-native";
import { textColor } from "../constants/colors";

type Props = {
    title: string;
    largeCharacterLimit?: number;
};

const DynamicSizedTitle: React.FC<Props> = ({
    title,
    largeCharacterLimit = 40,
}) => (
    <Text
        style={[
            styles.title,
            title.length > largeCharacterLimit && styles.titleSmall,
        ]}>
        {title}
    </Text>
);

const styles = StyleSheet.create({
    title: {
        color: textColor,
        fontSize: 24,
        fontWeight: "bold",
    },
    titleSmall: {
        fontSize: 20,
    },
});

export default DynamicSizedTitle;

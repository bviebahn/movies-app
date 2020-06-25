import React from "react";
import { StyleSheet, View } from "react-native";
import { textColorSecondary } from "../constants/colors";

type Props = {
    children: [React.ReactElement?, React.ReactElement?];
};

const DotSeperatedLine: React.FC<Props> = ({ children }) => {
    const [firstChild, secondChild] = children;
    return (
        <View style={styles.dotSeperatedLine}>
            {firstChild}
            {firstChild && secondChild ? (
                <View style={styles.dot} />
            ) : undefined}
            {secondChild}
        </View>
    );
};

const styles = StyleSheet.create({
    dotSeperatedLine: {
        flexDirection: "row",
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginHorizontal: 8,
        marginTop: "auto",
        marginBottom: "auto",
        backgroundColor: textColorSecondary,
    },
});

export default DotSeperatedLine;

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { primaryColorLight } from "../constants/colors";
import { secondaryText } from "../constants/styles";

type Props = {
    data: ReadonlyArray<{
        key: string;
        value: string;
    }>;
};

const InfoBox: React.FC<Props> = ({ data }) => (
    <>
        {data.map(({ key, value }) => (
            <View key={key}>
                <Text style={styles.infoKey}>{key}</Text>
                <Text style={secondaryText}>{value}</Text>
            </View>
        ))}
    </>
);

const styles = StyleSheet.create({
    infoKey: {
        color: primaryColorLight,
        marginTop: 10,
        marginBottom: 2,
        fontWeight: "bold",
    },
});

export default InfoBox;

import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";

import { gray2 } from "../constants/colors";
import { secondaryText } from "../constants/styles";

type Props = {
    data: ReadonlyArray<string>;
    onPressItem: (item: string) => void;
};

const ChipSelector: React.FC<Props> = ({ data, onPressItem }) => {
    return (
        <FlatList
            data={data}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => onPressItem(item)}
                    style={styles.chip}>
                    <Text style={secondaryText}>{item}</Text>
                </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    chip: {
        borderRadius: 16,
        backgroundColor: gray2,
        paddingHorizontal: 10,
        height: 32,
        marginHorizontal: 5,
        justifyContent: "center",
    },
});

export default ChipSelector;

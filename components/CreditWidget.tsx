import React from "react";
import Carousel from "./Carousel";
import CreditTile, { itemWidth } from "./CreditTile";
import { StyleSheet, View, Text } from "react-native";
import { textColor } from "../constants/colors";

type Props = {
    credits: ReadonlyArray<{
        id: number;
        name: string;
        character: string;
        profilePath?: string;
    }>;
};

const itemHorizontalMargin = 10;

const CreditWidget: React.FC<Props> = ({ credits }) => {
    return (
        <View>
            <Text style={styles.title}>Credits</Text>
            <Carousel
                data={credits}
                renderItem={({ name, character, profilePath }) => (
                    <CreditTile
                        name={name}
                        character={character}
                        profilePath={profilePath}
                        style={styles.tile}
                    />
                )}
                keyExtractor={({ id }) => `${id}`}
                itemWidth={itemWidth + itemHorizontalMargin * 2}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        color: textColor,
        fontSize: 26,
        margin: 20,
        marginBottom: 0,
    },
    tile: {
        marginHorizontal: itemHorizontalMargin,
        marginVertical: 10,
    },
});

export default CreditWidget;

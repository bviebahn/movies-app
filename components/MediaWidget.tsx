import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import Carousel from "./Carousel";
import { headline } from "../constants/styles";

type Props<T> = {
    title: string;
    data?: ReadonlyArray<T>;
    renderItem: (item: T) => React.ReactElement;
    itemWidth: number;
    keyExtractor: (item: T) => string;
};

const MediaWidget: <T>(p: Props<T>) => React.ReactElement<Props<T>> = ({
    title,
    data,
    renderItem,
    itemWidth,
    keyExtractor,
}) => {
    return (
        <View>
            <Text style={headline}>{title}</Text>
            {data ? (
                <Carousel
                    data={data}
                    itemWidth={itemWidth}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                />
            ) : (
                <ActivityIndicator style={styles.activityIndicator} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    activityIndicator: {
        marginTop: 50,
    },
});

export default MediaWidget;

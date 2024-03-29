import React from "react";
import {
    ActivityIndicator,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from "react-native";
import { headline } from "../constants/styles";
import Carousel from "./Carousel";

type Props<T> = {
    title: string;
    data?: ReadonlyArray<T>;
    renderItem: (item: T) => React.ReactElement;
    itemWidth: number;
    keyExtractor: (item: T) => string;
    style?: StyleProp<ViewStyle>;
};

const MediaWidget: <T>(p: Props<T>) => React.ReactElement<Props<T>> = ({
    title,
    data,
    renderItem,
    itemWidth,
    keyExtractor,
    style,
}) => {
    return (
        <View style={style}>
            <Text style={[headline, styles.title]}>{title}</Text>
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
    title: {
        marginLeft: 20,
    },
    activityIndicator: {
        marginTop: 50,
    },
});

export default MediaWidget;

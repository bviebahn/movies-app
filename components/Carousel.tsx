import React from "react";
import { FlatList, useWindowDimensions } from "react-native";

type Props<T> = {
    data: ReadonlyArray<T>;
    renderItem: (item: T) => React.ReactElement;
    keyExtractor: (item: T) => string;
    itemWidth: number;
};

const Carousel: <T>(p: Props<T>) => React.ReactElement<Props<T>> = ({
    data,
    renderItem,
    keyExtractor,
    itemWidth,
}) => {
    const { width: screenWidth } = useWindowDimensions();

    const elementsPerInterval = Math.floor(screenWidth / itemWidth);

    const snapOffsets = [...Array(data.length - 1)].reduce(
        (prev, _, index) => {
            return [...prev, prev[index] + elementsPerInterval * itemWidth];
        },
        [0]
    );

    return (
        <FlatList
            horizontal
            data={data}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={keyExtractor}
            pagingEnabled
            snapToOffsets={snapOffsets}
            decelerationRate="fast"
            initialNumToRender={(elementsPerInterval + 1) * 2}
            showsHorizontalScrollIndicator={false}
        />
    );
};

export default Carousel;

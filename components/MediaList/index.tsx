import React from "react";
import { FlatList, FlatListProps } from "react-native";
import { Movie, Person, TvShow } from "../../tmdb/types";
import MediaListItem from "./MediaListItem";

type Props<T> = {
    data: ReadonlyArray<T> | undefined;
    onPressItem: (item: T) => void;
} & Partial<FlatListProps<T>>;

const MediaList: <T extends Movie | TvShow | Person>(
    p: Props<T>
) => React.ReactElement<Props<T>> = ({ data, onPressItem, ...restProps }) => (
    <FlatList
        data={data}
        renderItem={({ item }) => (
            <MediaListItem item={item} onPress={() => onPressItem(item)} />
        )}
        keyExtractor={item => `${item.mediaType}:${item.id}`}
        keyboardShouldPersistTaps="never"
        keyboardDismissMode="on-drag"
        {...restProps}
    />
);

export default MediaList;

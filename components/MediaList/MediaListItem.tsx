import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import {
    gray0,
    gray5,
    ratedYellow,
    textColorSecondary,
} from "../../constants/colors";
import { shadowStyle } from "../../constants/styles";
import { Movie, Person, TvShow } from "../../tmdb/types";
import useImageUrl from "../../tmdb/useImageUrl";
import { formatDate } from "../../util/date";
import DotSeperatedLine from "../DotSeperatedLine";
import Rating from "../Rating";

type Props = {
    item: ((Movie | TvShow) & { accountRating?: number }) | Person;
    onPress: () => void;
};

const AccountRating: React.FC<{ rating: number }> = ({ rating }) => (
    <>
        <Icon name="star" color={ratedYellow} size={16} />
        <Text style={styles.accountRatingText}>{rating / 2}</Text>
    </>
);

const MediaListItem: React.FC<Props> = ({ item, onPress }) => {
    const title = item.mediaType === "movie" ? item.title : item.name;

    const getImageUrl = useImageUrl();
    const imagePath =
        item.mediaType === "person" ? item.profilePath : item.posterPath;
    const imageType = item.mediaType === "person" ? "profile" : "poster";
    const imageSize = item.mediaType === "person" ? "medium" : "small";

    const releaseDate = (() => {
        if (item.mediaType === "person") {
            return undefined;
        }
        return item.mediaType === "movie"
            ? item.releaseDate
            : item.firstAirDate;
    })();

    const overview = item.mediaType === "person" ? undefined : item.overview;
    const voteAverage =
        item.mediaType === "person" ? undefined : item.voteAverage;

    const accountRating =
        item.mediaType !== "person" ? item.accountRating : undefined;

    return (
        <View style={styles.borderBottom}>
            <RectButton onPress={onPress} style={styles.searchListItem}>
                {imagePath ? (
                    <View style={shadowStyle}>
                        <Image
                            source={{
                                uri: getImageUrl(
                                    imagePath,
                                    imageType,
                                    imageSize
                                ),
                            }}
                            style={styles.itemImage}
                        />
                    </View>
                ) : undefined}
                <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{title}</Text>
                    <DotSeperatedLine>
                        {releaseDate ? (
                            <Text style={styles.itemDate}>
                                {formatDate(new Date(releaseDate))}
                            </Text>
                        ) : undefined}
                        {accountRating ? (
                            <AccountRating rating={accountRating} />
                        ) : undefined}
                    </DotSeperatedLine>
                    {overview ? (
                        <Text style={styles.itemOverview} numberOfLines={5}>
                            {overview}
                        </Text>
                    ) : undefined}
                </View>
                {voteAverage ? (
                    <Rating percent={voteAverage * 10} style={styles.rating} />
                ) : undefined}
            </RectButton>
        </View>
    );
};

const styles = StyleSheet.create({
    borderBottom: {
        borderColor: "#000",
        borderBottomWidth: 1,
    },
    searchListItem: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: gray0,
        borderColor: "#333",
        borderBottomWidth: 1,
        padding: 10,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: textColorSecondary,
        marginBottom: 4,
    },
    itemInfo: { marginHorizontal: 10, flexShrink: 1 },
    itemImage: { width: 80, height: 120, borderRadius: 4 },
    itemOverview: {
        color: textColorSecondary,
    },
    itemDate: {
        color: gray5,
    },
    rating: { marginLeft: "auto", marginBottom: "auto" },
    accountRatingText: {
        color: ratedYellow,
        marginLeft: 5,
        fontWeight: "bold",
        fontSize: 12,
    },
});

export default MediaListItem;

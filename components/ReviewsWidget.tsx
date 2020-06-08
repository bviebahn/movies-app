import React from "react";
import Carousel from "./Carousel";
import { Review } from "../tmdb/types";
import {
    useWindowDimensions,
    StyleProp,
    ViewStyle,
    Text,
    TouchableOpacity,
    StyleSheet,
    View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { textColor, gray2, primaryColor } from "../constants/colors";
import { shadowStyle, headline } from "../constants/styles";
import translate from "../i18/Locale";

type Props = {
    reviews: ReadonlyArray<Review>;
};

type ReviewTileProps = {
    author: string;
    content: string;
    style?: StyleProp<ViewStyle>;
};

const ReviewTile: React.FC<ReviewTileProps> = ({ author, content, style }) => {
    const strippedContent =
        content.length < 200
            ? content
            : `${content.substr(0, content.indexOf(" ", 200) || 200)}...`;
    return (
        <TouchableOpacity style={[styles.reviewTile, shadowStyle, style]}>
            <Text style={styles.author}>
                {translate("BY", { name: author })}
            </Text>
            <Markdown style={markdownStyle}>{strippedContent}</Markdown>
            <Text style={styles.readMore}>{translate("READ_MORE")}</Text>
        </TouchableOpacity>
    );
};

const ReviewsWidget: React.FC<Props> = ({ reviews }) => {
    const { width } = useWindowDimensions();
    return (
        <View>
            <Text style={headline}>{translate("REVIEWS")}</Text>
            <Carousel
                data={reviews}
                renderItem={({ author, content }) => (
                    <ReviewTile
                        author={author}
                        content={content}
                        style={{ width: width - 100 }}
                    />
                )}
                keyExtractor={({ id }) => id}
                itemWidth={width - 80}
            />
        </View>
    );
};

const markdownStyle = {
    body: {
        color: textColor,
        overflow: "hidden" as "hidden",
        flex: 1,
    },
};

const styles = StyleSheet.create({
    reviewTile: {
        flex: 1,
        padding: 20,
        marginHorizontal: 10,
        margin: 10,
        backgroundColor: gray2,
        borderRadius: 8,
    },
    author: {
        color: textColor,
        fontWeight: "bold",
    },
    readMore: {
        color: primaryColor,
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 20,
    },
});

export default ReviewsWidget;

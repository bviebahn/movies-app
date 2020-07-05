import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList, FlatListProps, StyleSheet, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";

import {
    gray5,
    gray6,
    textColorSecondary,
    gray4,
    gray3,
} from "../../constants/colors";
import translate from "../../i18/Locale";
import { StartStackNavigationProp } from "../../navigators/StartStackNavigator";
import { PersonCredits } from "../../tmdb/types";
import { getDate } from "./util";

type Props = {
    credits?: PersonCredits;
} & Partial<FlatListProps<PersonCredits[0]>>;

const CreditsList: React.FC<Props> = ({ credits, ...restProps }) => {
    const navigation = useNavigation<
        StartStackNavigationProp<"PersonDetails">
    >();
    return (
        <FlatList
            data={credits}
            renderItem={({ item, index }) => {
                const role = (() => {
                    if (item.creditType === "crew") {
                        return item.job;
                    }
                    return item.character
                        ? translate("AS_CHARACTER", {
                              character: item.character,
                          })
                        : undefined;
                })();

                const date = getDate(item);
                const yearString = date ? date.slice(0, 4) : "    -   ";

                const isFirstInGroup = (() => {
                    if (index === 0) {
                        return true;
                    }
                    const prevItem = credits![index - 1];
                    const prevDate = getDate(prevItem);
                    return prevDate
                        ? prevDate.slice(0, 4) !== yearString
                        : false;
                })();

                const isLastInGroup = (() => {
                    if (index === credits!.length - 1) {
                        return true;
                    }
                    const nextItem = credits![index + 1];
                    const nextDate = getDate(nextItem);
                    return nextDate
                        ? nextDate.slice(0, 4) !== yearString
                        : false;
                })();

                return (
                    <ListItem
                        date={yearString}
                        title={
                            item.mediaType === "movie" ? item.title : item.name
                        }
                        role={role}
                        onPress={() => {
                            if (item.mediaType === "movie") {
                                navigation.push("MovieDetails", {
                                    movie: item,
                                });
                            } else {
                                navigation.push("TvShowDetails", {
                                    tvShow: item,
                                });
                            }
                        }}
                        isFirst={isFirstInGroup}
                        isLast={isLastInGroup}
                    />
                );
            }}
            keyExtractor={(item) => item.creditId}
            {...restProps}
        />
    );
};

type ListItemProps = {
    date?: string;
    title: string;
    role?: string;
    isFirst: boolean;
    isLast: boolean;
    onPress: () => void;
};

const ListItem: React.FC<ListItemProps> = ({
    date,
    title,
    role,
    isFirst,
    isLast,
    onPress,
}) => (
    <View style={styles.listItemWrapper}>
        <View style={styles.timeline} />
        {isFirst ? <View style={styles.timelineDot} /> : undefined}
        <View style={styles.listItemContent}>
            {isFirst ? <Text style={styles.date}>{date}</Text> : undefined}
            <View
                style={[
                    styles.border,
                    isFirst && styles.borderTop,
                    isLast && styles.borderBottom,
                ]}>
                <RectButton onPress={onPress} style={styles.listItem}>
                    <View style={styles.itemRight}>
                        <Text style={styles.title}>{title}</Text>
                        {role ? (
                            <Text style={styles.role}>{role}</Text>
                        ) : undefined}
                    </View>
                </RectButton>
            </View>
        </View>
    </View>
);

const styles = StyleSheet.create({
    listItemWrapper: { flexDirection: "row", marginLeft: 10 },
    listItem: {
        flex: 1,
        flexDirection: "row",
        paddingRight: 20,
        paddingLeft: 10,
    },
    listItemContent: { flex: 1 },
    border: {
        flex: 1,
        borderLeftColor: gray3,
        borderLeftWidth: 1,
        borderRightColor: gray3,
        borderRightWidth: 1,
        borderBottomColor: gray3,
        borderBottomWidth: 1,
        marginHorizontal: 20,
    },
    borderTop: {
        borderTopColor: gray3,
        borderTopWidth: 1,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        marginTop: 5,
    },
    borderBottom: {
        borderBottomColor: gray3,
        borderBottomWidth: 1,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    listHeaderTitle: {
        color: textColorSecondary,
        fontSize: 22,
        margin: 20,
        marginBottom: 5,
    },
    date: {
        color: gray6,
        fontSize: 20,
        marginTop: 20,
        marginLeft: 20,
    },
    title: {
        color: textColorSecondary,
        fontSize: 16,
        marginLeft: 10,
    },
    role: {
        color: gray5,
        marginLeft: 10,
        marginTop: 2,
    },
    itemRight: { flexShrink: 1, marginVertical: 10 },
    timeline: {
        borderLeftWidth: 2,
        borderLeftColor: gray4,
    },
    timelineDot: {
        backgroundColor: gray6,
        width: 8,
        height: 8,
        borderRadius: 4,
        top: 28,
        left: -3,
        position: "absolute",
    },
    timelineFirst: {
        height: "50%",
        marginTop: "auto",
    },
    timelineLast: {
        height: "50%",
        marginBottom: "auto",
    },
});

export default CreditsList;

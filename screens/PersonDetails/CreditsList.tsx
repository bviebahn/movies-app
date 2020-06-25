import React from "react";
import { PersonCredits } from "../../tmdb/types";
import { FlatList, Text, StyleSheet, FlatListProps, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { textColorSecondary, gray3 } from "../../constants/colors";
import translate from "../../i18/Locale";
import { useNavigation } from "@react-navigation/native";
import { StartStackNavigationProp } from "../../navigators/StartStackNavigator";

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
            renderItem={({ item }) => {
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
                return (
                    <ListItem
                        date={
                            item.mediaType === "movie"
                                ? item.releaseDate
                                : item.firstAirDate
                        }
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
    onPress: () => void;
};

const ListItem: React.FC<ListItemProps> = ({ date, title, role, onPress }) => (
    <RectButton onPress={onPress} style={styles.listItem}>
        <Text style={styles.date}>{date ? date.slice(0, 4) : "    -   "}</Text>
        <View style={styles.itemRight}>
            <Text style={styles.title}>{title}</Text>
            {role ? <Text style={styles.role}>{role}</Text> : undefined}
        </View>
    </RectButton>
);

const styles = StyleSheet.create({
    listItem: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    listHeaderTitle: {
        color: textColorSecondary,
        fontSize: 22,
        margin: 20,
        marginBottom: 5,
    },
    date: {
        fontSize: 16,
        color: gray3,
    },
    title: {
        color: textColorSecondary,
        fontSize: 16,
        marginLeft: 10,
    },
    role: {
        color: gray3,
        marginLeft: 10,
        marginTop: 2,
    },
    itemRight: { flexShrink: 1 },
});

export default CreditsList;

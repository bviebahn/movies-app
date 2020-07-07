import React from "react";
import useAccountLists from "../tmdb/useAccountLists";
import { AccountList } from "../tmdb/types";
import { View, Text, StyleProp, ViewStyle, StyleSheet } from "react-native";
import { textColorSecondary, gray0, gray4 } from "../constants/colors";

const List: React.FC<{ list: AccountList }> = ({
    list: { name, numberOfItems },
}) => (
    <View>
        <Text style={styles.listName}>{name}</Text>
        <Text style={styles.numberOfItems}>{numberOfItems}</Text>
    </View>
);

type Props = {
    style?: StyleProp<ViewStyle>;
};

const AccountLists: React.FC<Props> = ({ style }) => {
    const { data } = useAccountLists();

    const lists = data.reduce<AccountList[]>(
        (prev, curr) => [...prev, ...curr.results],
        [],
    );

    return (
        <View style={[styles.accountLists, style]}>
            {lists.map((list) => (
                <List list={list} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    accountLists: {
        padding: 20,
        backgroundColor: gray0,
        borderRadius: 8,
    },
    listName: {
        fontSize: 16,
        color: textColorSecondary,
        fontWeight: "bold",
    },
    numberOfItems: {
        color: gray4,
    },
});

export default AccountLists;

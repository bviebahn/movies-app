import React from "react";
import {
    FlatList,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";

import { gray0, gray6, textColorSecondary } from "../constants/colors";
import { headline, shadowStyle } from "../constants/styles";
import translate from "../i18/Locale";
import { AccountList } from "../tmdb/types";
import useAccountLists from "../tmdb/useAccountLists";
import { convertMinutesToTimeString } from "../util/time";
import DotSeperatedLine from "./DotSeperatedLine";

const List: React.FC<{ list: AccountList }> = ({
    list: { name, numberOfItems, runtime },
}) => (
    <View style={shadowStyle}>
        <RectButton style={styles.list}>
            <Text style={styles.listName}>{name}</Text>
            <DotSeperatedLine>
                <Text style={styles.listInfoText}>
                    {translate("ITEM_COUNT", { itemCount: numberOfItems })}
                </Text>
                <Text style={styles.listInfoText}>
                    {convertMinutesToTimeString(runtime)}
                </Text>
            </DotSeperatedLine>
        </RectButton>
    </View>
);

type Props = {
    style?: StyleProp<ViewStyle>;
    ListHeaderComponent?: React.ReactElement;
};

const AccountLists: React.FC<Props> = ({ style, ListHeaderComponent }) => {
    const { data } = useAccountLists();
    console.log(data);

    const lists = data?.reduce<AccountList[]>(
        (prev, curr) => [...prev, ...curr.results],
        [],
    );

    const listHeader = (
        <>
            {ListHeaderComponent}
            {lists?.length ? (
                <Text style={[headline, styles.listsHeadline]}>
                    {translate("YOUR_LISTS")}
                </Text>
            ) : undefined}
        </>
    );

    return (
        <View style={style}>
            <FlatList
                data={lists}
                renderItem={({ item }) => <List list={item} />}
                keyExtractor={(item) => `${item.id}`}
                ListHeaderComponent={listHeader}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    listName: {
        fontSize: 18,
        color: textColorSecondary,
        fontWeight: "bold",
        marginBottom: 5,
    },
    listInfoText: {
        color: gray6,
    },
    list: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginHorizontal: 20,
        marginVertical: 10,
        backgroundColor: gray0,
        borderRadius: 8,
    },
    listsHeadline: {
        margin: 20,
        marginBottom: 5,
    },
});

export default AccountLists;

import React from "react";
import useAccountLists from "../tmdb/useAccountLists";
import Modal from "react-native-modal";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { AccountList } from "../tmdb/types";
import { gray0, textColorSecondary } from "../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { headline } from "../constants/styles";

type Props = {
    visible: boolean;
    onClose: () => void;
};

const ListSelectionModal: React.FC<Props> = ({ visible, onClose }) => {
    const { data, isLoading } = useAccountLists({ enabled: visible });
    const { bottom } = useSafeAreaInsets();

    const lists = data?.reduce<AccountList[]>(
        (prev, curr) => [...prev, ...curr.results],
        []
    );

    const content = (() => {
        if (isLoading) {
            return <ActivityIndicator />;
        }

        return (
            <View
                style={[
                    styles.content,
                    {
                        paddingBottom: 20 + bottom,
                    },
                ]}>
                <Text style={headline}>Add to list...</Text>
                {lists?.map(list => (
                    <View style={styles.item}>
                        <Text style={styles.itemText}>{list.name}</Text>
                    </View>
                ))}
            </View>
        );
    })();

    return (
        <Modal
            isVisible={visible}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            onBackdropPress={onClose}
            style={styles.modal}>
            {content}
        </Modal>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: 20,
        backgroundColor: gray0,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    item: {
        marginHorizontal: 20,
        paddingVertical: 20,
        borderBottomColor: "#333",
        borderBottomWidth: 1,
    },
    itemText: { fontSize: 16, color: textColorSecondary },
    modal: { justifyContent: "flex-end", margin: 0 },
});

export default ListSelectionModal;

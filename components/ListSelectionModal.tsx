import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { gray0, textColorSecondary } from "../constants/colors";
import { headline } from "../constants/styles";
import { AccountList } from "../tmdb/types";
import useAccountLists from "../tmdb/useAccountLists";

type Props = {
    visible: boolean;
    onClose: () => void;
};

const ListSelectionModal: React.FC<Props> = ({ visible, onClose }) => {
    const { data, isLoading } = useAccountLists({ enabled: visible });
    const { bottom } = useSafeAreaInsets();

    const lists = (data?.pages || []).reduce(
        (prev, curr) => [...prev, ...curr.results],
        [] as AccountList[]
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

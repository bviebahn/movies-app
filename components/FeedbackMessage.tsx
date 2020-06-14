import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/FontAwesome";

import { gray0, gray2, gray3 } from "../constants/colors";

type Props = {
    iconName?: string;
    title: string;
    message: string;
    time?: number;
    isVisible: boolean;
};

const FeedbackMessage: React.FC<Props> = ({
    iconName,
    title,
    message,
    isVisible,
}) => {
    return (
        <Modal
            isVisible={isVisible}
            hasBackdrop={false}
            animationIn="pulse"
            animationOut="fadeOut">
            <View style={styles.content}>
                {iconName ? (
                    <Icon name={iconName} size={64} color={gray0} />
                ) : undefined}
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    content: {
        backgroundColor: gray2,
        paddingVertical: 40,
        paddingHorizontal: 10,
        width: 200,
        alignItems: "center",
        borderRadius: 8,
        alignSelf: "center",
    },
    title: {
        color: gray3,
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 5,
    },
    message: {
        color: gray3,
    },
});

export default FeedbackMessage;

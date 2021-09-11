import React from "react";
import { TouchableOpacity } from "react-native";

import useFeedbackMessage, { FeedbackProvider } from "../useFeedback";
import { render, fireEvent } from "react-native-testing-library";

describe("utils - useFeedback", () => {
    it("renders FeedbackMessage", () => {
        function Component() {
            const showFeedback = useFeedbackMessage();
            return (
                <TouchableOpacity
                    testID="button"
                    onPress={() =>
                        showFeedback(
                            {
                                title: "Feedback Title",
                                message: "Message",
                                iconName: "star",
                            },
                            1000
                        )
                    }
                />
            );
        }

        const { queryByText, queryAllByTestId, getByTestId } = render(
            <FeedbackProvider>
                <Component />
            </FeedbackProvider>
        );

        expect(queryByText("Feedback Title")).toBeNull();
        expect(queryAllByTestId("feedbackMessage")![0]).toHaveProperty(
            "props.visible",
            false
        );

        fireEvent.press(getByTestId("button"));
        expect(queryByText("Feedback Title")).not.toBeNull();
        expect(queryAllByTestId("feedbackMessage")![0]).toHaveProperty(
            "props.visible",
            true
        );
    });
});

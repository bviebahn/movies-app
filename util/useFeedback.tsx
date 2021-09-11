import React, { createContext, useContext, useRef, useState } from "react";

import FeedbackMessage from "../components/FeedbackMessage";

type ShowFeedbackFn = (
    content: { iconName: string; title: string; message?: string },
    time: number
) => void;

const FeedbackContext = createContext<
    | {
          showFeedback: ShowFeedbackFn;
      }
    | undefined
>(undefined);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [feedback, setFeedback] = useState<{
        icon?: string;
        title: string;
        message?: string;
        visible: boolean;
    }>({ title: "", visible: false });

    const timeout = useRef<ReturnType<typeof setTimeout>>();

    const showFeedback: ShowFeedbackFn = (
        { iconName, title, message },
        time
    ) => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
        setFeedback({
            icon: iconName,
            title,
            message,
            visible: true,
        });

        timeout.current = setTimeout(
            () => setFeedback(prev => ({ ...prev, visible: false })),
            time
        );
    };

    return (
        <FeedbackContext.Provider value={{ showFeedback }}>
            {children}
            <FeedbackMessage
                iconName={feedback.icon}
                title={feedback.title}
                message={feedback.message}
                isVisible={feedback.visible}
            />
        </FeedbackContext.Provider>
    );
};

const useFeedbackMessage = (): ((
    content: { iconName: string; title: string; message?: string },
    time: number
) => void) => {
    const context = useContext(FeedbackContext);
    if (!context) {
        throw new Error(
            "useFeedbackMessage must be used within a FeedbackProvider"
        );
    }

    return context.showFeedback;
};

export default useFeedbackMessage;

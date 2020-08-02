import React, { createContext, useContext, useState } from "react";
import ListSelectionModal from "../components/ListSelectionModal";

type ContextType = {
    showAccountListSelector: (
        mediaType: "movie" | "tv",
        mediaId: number
    ) => void;
    isVisible: boolean;
};

const AccountListSelectorContext = createContext<ContextType | undefined>(
    undefined
);

export const AccountListSelectorProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [state, setState] = useState<{
        mediaType?: string;
        mediaId?: number;
        visible: boolean;
    }>({ visible: false });

    const showAccountListSelector = (
        mediaType: "movie" | "tv",
        mediaId: number
    ) => {
        setState({ mediaType, mediaId, visible: true });
    };

    return (
        <AccountListSelectorContext.Provider
            value={{ showAccountListSelector, isVisible: state.visible }}>
            {children}
            <ListSelectionModal
                visible={state.visible}
                onClose={() => setState(s => ({ ...s, visible: false }))}
            />
        </AccountListSelectorContext.Provider>
    );
};

const useAccountListSelector = () => {
    const context = useContext(AccountListSelectorContext);
    if (!context) {
        throw new Error(
            "useAccountListSelector must be used within a AccountListSelectorProvider"
        );
    }

    return context;
};

export default useAccountListSelector;

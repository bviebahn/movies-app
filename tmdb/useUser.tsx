import React, { useEffect, useState, useContext } from "react";
import { read, write, remove } from "../util/asyncStorage";
import { fetchTmdb, convertAccount } from "./util";
import { Account, TmdbAccount } from "./types";

type UserContextType = {
    user?: Account;
    loading: boolean;
    sessionId?: string;
    createRequestToken: () => Promise<string | undefined>;
    createSessionId: (requestToken: string) => Promise<string | undefined>;
    logout: () => Promise<boolean>;
    markAsFavorite: (
        mediaType: "movie" | "tv",
        mediaId: number,
        favorite: boolean,
    ) => Promise<{ success: boolean; favorite: boolean }>;
    addToWatchlist: (
        mediaType: "movie" | "tv",
        mediaId: number,
        favorite: boolean,
    ) => Promise<{ success: boolean; watchlist: boolean }>;
    rate: (
        mediaType: "movie" | "tv",
        mediaId: number,
        rating?: number,
    ) => Promise<{ success: boolean; rating?: number }>;
};

const UserContext = React.createContext<UserContextType | undefined>(undefined);

const SESSION_ID_KEY = "SESSION_ID";

type State = {
    sessionId?: string;
    account?: Account;
    loading: boolean;
    // list?: {
    //     [key: "favorite"]
    // }
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [sessionId, setSessionId] = useState<string>();
    const [user, setUser] = useState<Account>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const storageSessionId = await read(SESSION_ID_KEY);
            if (storageSessionId) {
                setSessionId(storageSessionId);
            }
        })();
    }, []);

    useEffect(() => {
        if (sessionId) {
            (async () => {
                setLoading(true);
                const userDetailsResponse = await fetchTmdb(
                    `/account?session_id=${sessionId}`,
                );

                if (userDetailsResponse.ok) {
                    const result: TmdbAccount = await userDetailsResponse.json();
                    const account = convertAccount(result);
                    setUser(account);
                }
                setLoading(false);
            })();
        }
    }, [sessionId]);

    const createRequestToken = async () => {
        const requestTokenResponse = await fetchTmdb(
            "/authentication/token/new",
        );

        if (requestTokenResponse.ok) {
            const result = await requestTokenResponse.json();

            if (result.success) {
                return result.request_token as string;
            }
        }
        return undefined;
    };

    const createSessionId = async (requestToken: string) => {
        setLoading(true);
        const sessionIdResponse = await fetchTmdb(
            `/authentication/session/new?request_token=${requestToken}`,
            { method: "POST" },
        );

        if (sessionIdResponse.ok) {
            const result = await sessionIdResponse.json();
            if (result.success) {
                setSessionId(result.session_id);
                await write(SESSION_ID_KEY, result.session_id);
                return result.session_id as string;
            }
        }

        return undefined;
    };

    const logout = async () => {
        if (!sessionId) {
            return false;
        }
        setLoading(true);
        const response = await fetchTmdb(
            `/authentication/session?session_id=${sessionId}`,
            { method: "DELETE" },
        );

        const success = response.ok;
        if (success) {
            setSessionId(undefined);
            setUser(undefined);
            await remove(SESSION_ID_KEY);
        }
        setLoading(false);
        return success;
    };

    const markAsFavorite = async (
        mediaType: "movie" | "tv",
        mediaId: number,
        favorite: boolean,
    ) => {
        if (user) {
            const response = await fetchTmdb(
                `/account/${user.id}/favorite?session_id=${sessionId}`,
                {
                    method: "POST",
                    body: {
                        media_type: mediaType,
                        media_id: mediaId,
                        favorite,
                    },
                },
            );
            if (response.ok) {
                return { success: true, favorite };
            }
        }
        return { success: false, favorite: !favorite };
    };

    const addToWatchlist = async (
        mediaType: "movie" | "tv",
        mediaId: number,
        watchlist: boolean,
    ) => {
        if (user) {
            const response = await fetchTmdb(
                `/account/${user.id}/watchlist?session_id=${sessionId}`,
                {
                    method: "POST",
                    body: {
                        media_type: mediaType,
                        media_id: mediaId,
                        watchlist,
                    },
                },
            );
            if (response.ok) {
                return { success: true, watchlist };
            }
        }
        return { success: false, watchlist: !watchlist };
    };

    const rate = async (
        mediaType: "movie" | "tv",
        mediaId: number,
        rating?: number,
    ) => {
        if (user) {
            const response = await fetchTmdb(
                `/${mediaType}/${mediaId}/rating?session_id=${sessionId}`,
                { method: rating ? "POST" : "DELETE", body: { value: rating } },
            );

            if (response.ok) {
                return {
                    success: true,
                    rating,
                };
            }
        }
        return { success: false };
    };

    return (
        <UserContext.Provider
            value={{
                user,
                loading,
                sessionId,
                createRequestToken,
                createSessionId,
                logout,
                markAsFavorite,
                addToWatchlist,
                rate,
            }}>
            {children}
        </UserContext.Provider>
    );
};

const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export default useUser;

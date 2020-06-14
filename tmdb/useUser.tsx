import React, { useEffect, useState, useContext } from "react";
import { read, write } from "../util/asyncStorage";
import { fetchTmdb, convertAccount } from "./util";
import { Account, TmdbAccount } from "./types";

type UserContextType = {
    user?: Account;
    sessionId?: string;
    createRequestToken: () => Promise<string | undefined>;
    createSessionId: (requestToken: string) => Promise<string | undefined>;
    markAsFavorite: (
        mediaType: "movie" | "tv",
        mediaId: number,
        favorite: boolean,
    ) => Promise<boolean>;
    addToWatchlist: (
        mediaType: "movie" | "tv",
        mediaId: number,
        favorite: boolean,
    ) => Promise<boolean>;
    rate: (
        mediaType: "movie" | "tv",
        mediaId: number,
        rating?: number,
    ) => Promise<boolean>;
};

const UserContext = React.createContext<UserContextType | undefined>(undefined);

const SESSION_ID_KEY = "SESSION_ID";

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [sessionId, setSessionId] = useState<string>();
    const [user, setUser] = useState<Account>();

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
                const userDetailsResponse = await fetchTmdb(
                    `account?session_id=${sessionId}`,
                );

                if (userDetailsResponse.ok) {
                    const result: TmdbAccount = await userDetailsResponse.json();
                    const account = convertAccount(result);
                    setUser(account);
                }
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
        const sessionIdResponse = await fetchTmdb(
            `authentication/session/new?request_token=${requestToken}`,
            "POST",
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

    const markAsFavorite = async (
        mediaType: "movie" | "tv",
        mediaId: number,
        favorite: boolean,
    ) => {
        if (user) {
            const response = await fetchTmdb(
                `account/${user.id}/favorite?session_id=${sessionId}`,
                "POST",
                { media_type: mediaType, media_id: mediaId, favorite },
            );
            return response.ok;
        }
        return false;
    };

    const addToWatchlist = async (
        mediaType: "movie" | "tv",
        mediaId: number,
        watchlist: boolean,
    ) => {
        if (user) {
            const response = await fetchTmdb(
                `account/${user.id}/watchlist?session_id=${sessionId}`,
                "POST",
                { media_type: mediaType, media_id: mediaId, watchlist },
            );
            return response.ok;
        }
        return false;
    };

    const rate = async (
        mediaType: "movie" | "tv",
        mediaId: number,
        rating?: number,
    ) => {
        console.log("useUser rate", user);

        if (user) {
            const response = await fetchTmdb(
                `${mediaType}/${mediaId}/rating?session_id=${sessionId}`,
                rating ? "POST" : "DELETE",
                { value: rating },
            );
            console.log(await response.json());

            return response.ok;
        }
        return false;
    };

    return (
        <UserContext.Provider
            value={{
                user,
                sessionId,
                createRequestToken,
                createSessionId,
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

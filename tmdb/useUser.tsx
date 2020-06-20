import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";

import { read, write, remove } from "../util/asyncStorage";
import { Account, TmdbAccount } from "./types";
import { convertAccount, fetchTmdb } from "./util";

type UserContextType = {
    /** v3 user */
    user?: Account;
    /** v3 sessionId */
    sessionId?: string;
    /** v4 accessToken */
    accessToken?: string;
    /** v4 accountId */
    accountId?: string;
    loading: boolean;
    auth: (requestToken: string) => Promise<void>;
    logout: () => Promise<boolean>;
};

const UserContext = React.createContext<UserContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = "ACCESS_TOKEN";
const ACCOUNT_ID_KEY = "ACCOUNT_ID";
const SESSION_ID_KEY = "SESSION_ID";

async function fetchUser(_key: "user", sessionId?: string) {
    if (!sessionId) {
        throw new Error("sessionId missing in fetchUser");
    }
    const response = await fetchTmdb(`/account?session_id=${sessionId}`);

    if (response.ok) {
        const result: TmdbAccount = await response.json();
        return convertAccount(result);
    }

    throw new Error("Error fetching User");
}

export async function createRequestToken() {
    const response = await fetchTmdb("/auth/request_token", {
        method: "POST",
        version: 4,
    });

    if (response.ok) {
        const result = await response.json();

        if (result.success) {
            return result.request_token as string;
        }
    }
    throw new Error("Error creating requestToken");
}

async function createAccessToken(
    requestToken: string,
): Promise<{ accessToken: string; accountId: string }> {
    const response = await fetchTmdb(
        `/auth/access_token?request_token=${requestToken}`,
        { method: "POST", version: 4 },
    );

    if (response.ok) {
        const result = await response.json();
        if (result.success) {
            return {
                accessToken: result.access_token,
                accountId: result.account_id,
            };
        }
    }
    throw new Error("Error creating accessToken");
}

async function createSessionId(accessToken: string) {
    const response = await fetchTmdb(
        `/authentication/session/convert/4?access_token=${accessToken}`,
        { method: "POST" },
    );

    if (response.ok) {
        const result = await response.json();
        if (result.success) {
            return result.session_id as string;
        }
    }
    throw new Error("Error creating sessionId");
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [accessToken, setAccessToken] = useState<string>();
    const [accountId, setAccountId] = useState<string>();
    const [sessionId, setSessionId] = useState<string>();
    const { data: user, status, refetch } = useQuery(
        ["user", sessionId],
        fetchUser,
        {
            manual: true,
        },
    );

    useEffect(() => {
        (async () => {
            const [
                storageAccessToken,
                storageAccountId,
                storageSessionId,
            ] = await Promise.all([
                read(ACCESS_TOKEN_KEY),
                read(ACCOUNT_ID_KEY),
                read(SESSION_ID_KEY),
            ]);

            if (storageAccessToken) {
                setAccessToken(storageAccessToken);
            }
            if (storageAccountId) {
                setAccountId(storageAccountId);
            }
            if (storageSessionId) {
                setSessionId(storageSessionId);
            }
        })();
    }, []);

    useEffect(() => {
        if (sessionId) {
            refetch();
        }
    }, [sessionId, refetch]);

    async function auth(requestToken: string) {
        const {
            accessToken: newAccessToken,
            accountId: newAccountId,
        } = await createAccessToken(requestToken);

        setAccessToken(newAccessToken);
        setAccountId(newAccountId);
        const newSessionId = await createSessionId(newAccessToken);

        setSessionId(newSessionId);
        await Promise.all([
            write(ACCESS_TOKEN_KEY, newAccessToken),
            write(ACCOUNT_ID_KEY, newAccountId),
            write(SESSION_ID_KEY, newSessionId),
        ]);
    }

    const logout = async () => {
        // TODO: use react-query and clear user related caches
        const response = await fetchTmdb(
            `/authentication/session?session_id=${sessionId}`,
            { method: "DELETE" },
        );

        const success = response.ok;
        if (success) {
            setSessionId(undefined);
            setAccessToken(undefined);
            setAccountId(undefined);

            await Promise.all([
                remove(SESSION_ID_KEY),
                remove(ACCESS_TOKEN_KEY),
                remove(ACCOUNT_ID_KEY),
            ]);
        }

        return success;
    };

    return (
        <UserContext.Provider
            value={{
                user: sessionId ? user : undefined,
                loading: status === "loading",
                accessToken,
                accountId,
                sessionId,
                auth,
                logout,
            }}>
            {children}
        </UserContext.Provider>
    );
};

function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}

export default useUser;

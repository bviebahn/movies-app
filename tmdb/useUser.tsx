import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";

import { read, write } from "../util/asyncStorage";
import { Account, TmdbAccount } from "./types";
import { convertAccount, fetchTmdb } from "./util";

type UserContextType = {
    user?: Account;
    sessionId?: string;
    accessToken?: string;
    loading: boolean;
    auth: (requestToken: string) => Promise<void>;
    logout: () => Promise<boolean>;
};

const UserContext = React.createContext<UserContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = "ACCESS_TOKEN";
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

async function createAccessToken(requestToken: string) {
    const response = await fetchTmdb(
        `/auth/access_token?request_token=${requestToken}`,
        { method: "POST", version: 4 },
    );

    if (response.ok) {
        const result = await response.json();
        if (result.success) {
            return result.access_token as string;
        }
    }
    throw new Error("Error creating accessToken");
}

async function createSessionId(accessToken: string) {
    // TODO: accessToken in body?
    const response = await fetchTmdb(
        `/authentication/session/convert/4?access_token=${accessToken}`,
        { method: "POST" },
    );

    if (response.ok) {
        const result = await response.json();
        console.log("createSessionId", result);
        if (result.success) {
            return result.session_id as string;
        }
    }
    throw new Error("Error creating sessionId");
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    // v4 access token
    const [accessToken, setAccessToken] = useState<string>();
    // v3 sessionId
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
            const storageSessionId = await read(SESSION_ID_KEY);
            if (storageSessionId) {
                setSessionId(storageSessionId);
            }
        })();
    }, []);

    useEffect(() => {
        if (sessionId) {
            console.log("fetching user");
            refetch();
        }
    }, [sessionId, refetch]);

    async function auth(requestToken: string) {
        const newAccessToken = await createAccessToken(requestToken);
        console.log("newAccessToken", newAccessToken);

        setAccessToken(newAccessToken);
        const newSessionId = await createSessionId(newAccessToken);
        console.log("newSessionId", newSessionId);

        setSessionId(newSessionId);
        await Promise.all([
            write(ACCESS_TOKEN_KEY, newAccessToken),
            write(SESSION_ID_KEY, newSessionId),
        ]);
    }

    const logout = async () => {
        // TODO:
        // if (!accessToken) {
        //     console.log("no accessToken");
        //     return false;
        // }
        // const response = await fetchTmdb(`/auth/access_token`, {
        //     method: "DELETE",
        //     version: 4,
        //     accessToken,
        //     body: { access_token: accessToken },
        // });
        // console.log("resp", response);
        // const success = response.ok;
        // if (success) {
        //     console.log("success delete accessToken");
        //     setSessionId(undefined); TODO:
        //     setAccessToken(undefined);
        //     await remove(SESSION_ID_KEY);
        // }
        // return success;
        return true;
    };

    return (
        <UserContext.Provider
            value={{
                user: sessionId ? user : undefined,
                loading: status === "loading",
                accessToken,
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

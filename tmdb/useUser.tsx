import React, { useEffect, useState, useContext } from "react";
import { read, write } from "../util/asyncStorage";
import { fetchTmdb, convertAccount } from "./util";
import { Account, TmdbAccount } from "./types";

type UserContextType = {
    user?: Account;
    createRequestToken: () => Promise<string | undefined>;
    createSessionId: (requestToken: string) => Promise<string | undefined>;
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
                    setUser(convertAccount(result));
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
            `/authentication/session/new?request_token=${requestToken}`,
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

    return (
        <UserContext.Provider
            value={{ user, createRequestToken, createSessionId }}>
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

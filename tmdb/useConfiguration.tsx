import React, { useContext, useEffect, useState } from "react";

import { read, write } from "../util/asyncStorage";
import { Configuration, TmdbConfiguration } from "./types";
import { fetchTmdb } from "./util";

type ContextType = { configuration?: Configuration };

const ConfigurationContext = React.createContext<ContextType | undefined>(
    undefined,
);

const LAST_FETCHED_STORAGE_KEY = "LAST_CONFIGURATION_FETCH";
const CONFIG_STORAGE_KEY = "CONFIGURATION";

function convertConfiguration(config: TmdbConfiguration): Configuration {
    return {
        images: {
            baseUrl: config.images.base_url,
            secureBaseUrl: config.images.secure_base_url,
            backdropSizes: config.images.backdrop_sizes,
            logoSizes: config.images.logo_sizes,
            posterSizes: config.images.poster_sizes,
            profileSizes: config.images.profile_sizes,
            stillSizes: config.images.still_sizes,
        },
    };
}

export const ConfigurationProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, setState] = useState<Configuration>();
    useEffect(() => {
        const fetchConfig = async () => {
            const response = await fetchTmdb("/configuration");

            if (response.ok) {
                const result: TmdbConfiguration = await response.json();
                const config = convertConfiguration(result);
                setState(config);
                write(LAST_FETCHED_STORAGE_KEY, Date.now().toString(10));
                write(CONFIG_STORAGE_KEY, JSON.stringify(config));
            }
        };
        (async () => {
            const lastFetched = parseInt(
                (await read(LAST_FETCHED_STORAGE_KEY)) || "0",
                10,
            );
            if (Date.now() > lastFetched + 7 * 24 * 60 * 60 * 1000) {
                fetchConfig();
            } else {
                const c = await read(CONFIG_STORAGE_KEY);

                if (!c) {
                    fetchConfig();
                } else {
                    setState(JSON.parse(c));
                }
            }
        })();
    }, []);

    return (
        <ConfigurationContext.Provider value={{ configuration: state }}>
            {children}
        </ConfigurationContext.Provider>
    );
};

function useConfiguration() {
    const context = useContext(ConfigurationContext);
    if (!context) {
        throw new Error(
            "useConfiguration must be used within a ConfigurationProvider",
        );
    }
    return context;
}

export default useConfiguration;

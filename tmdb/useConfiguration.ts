import { useEffect, useState } from "react";

import { read, write } from "../util/asyncStorage";
import { Configuration, TmdbConfiguration } from "./types";
import { fetchTmdb } from "./util";
import { useQuery } from "react-query";

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

async function fetchConfiguration() {
    const response = await fetchTmdb("/configuration");
    if (response.ok) {
        const result: TmdbConfiguration = await response.json();
        return convertConfiguration(result);
    }

    throw new Error("Error fetching Configuration");
}

function useConfiguration() {
    const [state, setState] = useState<Configuration>();
    const { refetch } = useQuery("configuration", fetchConfiguration, {
        manual: true,
        cacheTime: Infinity,
        onSuccess: (config) => {
            setState(config);
            write(LAST_FETCHED_STORAGE_KEY, Date.now().toString(10));
            write(CONFIG_STORAGE_KEY, JSON.stringify(config));
        },
    });
    useEffect(() => {
        (async () => {
            console.log("reading from storage0");
            const lastFetched = parseInt(
                (await read(LAST_FETCHED_STORAGE_KEY)) || "0",
                10,
            );
            if (Date.now() > lastFetched + 7 * 24 * 60 * 60 * 1000) {
                refetch();
            } else {
                console.log("reading from storage1");

                const c = await read(CONFIG_STORAGE_KEY);

                if (!c) {
                    refetch();
                } else {
                    setState(JSON.parse(c));
                }
            }
        })();
    }, [refetch]);

    return state;
}

export default useConfiguration;

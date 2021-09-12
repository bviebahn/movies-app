import { useQuery } from "react-query";
import { read, write } from "../util/asyncStorage";
import QueryKeys from "../util/queryKeys";
import { Configuration, TmdbConfiguration } from "./types";
import { fetchTmdb } from "./util";

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

async function readConfigFromStorage(): Promise<Configuration | undefined> {
    const lastFetched = parseInt(
        (await read(LAST_FETCHED_STORAGE_KEY)) || "0",
        10
    );
    if (Date.now() > lastFetched + 7 * 24 * 60 * 60 * 1000) {
        return undefined;
    } else {
        const c = await read(CONFIG_STORAGE_KEY);

        if (!c) {
            return undefined;
        } else {
            return JSON.parse(c);
        }
    }
}

async function fetchConfiguration() {
    const storageConfig = await readConfigFromStorage();
    if (storageConfig) {
        return storageConfig;
    }
    const response = await fetchTmdb("/configuration");
    if (response.ok) {
        const result: TmdbConfiguration = await response.json();
        return convertConfiguration(result);
    }

    throw new Error("Error fetching Configuration");
}

function useConfiguration() {
    return useQuery(QueryKeys.Configuration, fetchConfiguration, {
        staleTime: Infinity,
        onSuccess: config => {
            write(LAST_FETCHED_STORAGE_KEY, Date.now().toString(10));
            write(CONFIG_STORAGE_KEY, JSON.stringify(config));
        },
    });
}

export default useConfiguration;

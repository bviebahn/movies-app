import { convertTvShow, fetchTmdb } from "./util";
import { useQuery } from "react-query";
import { TvShow } from "./types";

type Type = "popular" | "latest" | "airing_today" | "top_rated" | "on_the_air";

async function fetchTvShows(_key: string, type: Type) {
    const response = await fetchTmdb(`/tv/${type}`);

    if (response.ok) {
        const tvShows = await response.json();
        return tvShows.results.map(convertTvShow) as ReadonlyArray<TvShow>;
    }
    throw new Error("Error fetching TV Shows");
}

function useTvShows(type: Type) {
    return useQuery(["tv-shows", type], fetchTvShows);
}

export default useTvShows;

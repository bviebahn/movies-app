import { useQuery } from "react-query";
import QueryKeys from "../util/queryKeys";
import { TvShow } from "./types";
import { convertTvShow, fetchTmdb } from "./util";

export type TvShowListType =
    | "popular"
    | "latest"
    | "airing_today"
    | "top_rated"
    | "on_the_air";

async function fetchTvShows(type: TvShowListType) {
    const response = await fetchTmdb(`/tv/${type}`);

    if (response.ok) {
        const tvShows = await response.json();
        return tvShows.results.map(convertTvShow) as ReadonlyArray<TvShow>;
    }
    throw new Error("Error fetching TV Shows");
}

function useTvShows(type: TvShowListType) {
    return useQuery(QueryKeys.TvShows(type), () => fetchTvShows(type));
}

export default useTvShows;

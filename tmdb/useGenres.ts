import { useQuery } from "react-query";
import QueryKeys from "../util/queryKeys";
import { Genre } from "./types";
import { fetchTmdb } from "./util";

async function fetchGenres(
    type: "movie" | "tv"
): Promise<ReadonlyArray<Genre>> {
    const response = await fetchTmdb(`/genre/${type}/list`);
    if (response.ok) {
        const result = await response.json();
        return result.genres;
    }

    throw new Error("Error fetching Genres");
}

function useGenres(type: "movie" | "tv") {
    return useQuery(QueryKeys.Genres(type), () => fetchGenres(type), {
        staleTime: Infinity,
    });
}

export default useGenres;

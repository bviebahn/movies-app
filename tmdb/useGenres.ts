import { Genre } from "./types";
import { fetchTmdb } from "./util";
import { useQuery } from "react-query";

async function fetchGenres(
    _key: string,
    type: "movie" | "tv",
): Promise<ReadonlyArray<Genre>> {
    const response = await fetchTmdb(`/genre/${type}/list`);
    if (response.ok) {
        const result = await response.json();
        return result.genres;
    }

    throw new Error("Error fetching Genres");
}

function useGenres(type: "movie" | "tv") {
    return useQuery(["genres", type], fetchGenres, { staleTime: Infinity });
}

export default useGenres;

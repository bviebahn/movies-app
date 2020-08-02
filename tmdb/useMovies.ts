import { useQuery } from "react-query";

import { convertMovie, fetchTmdb } from "./util";
import { Movie } from "./types";

type Type = "popular" | "latest" | "now_playing" | "top_rated" | "upcoming";

async function fetchMovies(_key: string, type: Type) {
    const response = await fetchTmdb(`/movie/${type}`);
    if (response.ok) {
        const movies = await response.json();
        return movies.results.map(convertMovie) as ReadonlyArray<Movie>;
    }
    throw new Error("Error fetching Movies");
}

function useMovies(type: Type) {
    return useQuery(["movies", type], fetchMovies);
}

export default useMovies;

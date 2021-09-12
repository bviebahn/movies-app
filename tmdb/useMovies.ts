import { useQuery } from "react-query";
import QueryKeys from "../util/queryKeys";
import { Movie } from "./types";
import { convertMovie, fetchTmdb } from "./util";

export type MovieListType =
    | "popular"
    | "latest"
    | "now_playing"
    | "top_rated"
    | "upcoming";

async function fetchMovies(type: MovieListType) {
    const response = await fetchTmdb(`/movie/${type}`);
    if (response.ok) {
        const movies = await response.json();
        return movies.results.map(convertMovie) as ReadonlyArray<Movie>;
    }
    throw new Error("Error fetching Movies");
}

function useMovies(type: MovieListType) {
    return useQuery(QueryKeys.Movies(type), () => fetchMovies(type));
}

export default useMovies;

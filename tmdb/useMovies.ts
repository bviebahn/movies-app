import { useState, useEffect } from "react";
import { Movie } from "./types";
import { TMDB_BASE_URL, TMDB_ACCESS_TOKEN } from "./constants";
import { convertMovie } from "./util";

const useMovies = (
    type: "popular" | "latest" | "now_playing" | "top_rated" | "upcoming",
) => {
    const [data, setData] = useState<ReadonlyArray<Movie>>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchMovies = async () => {
            const response = await fetch(`${TMDB_BASE_URL}movie/${type}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
                },
            });

            setLoading(false);
            if (response.ok) {
                const movies = await response.json();
                setData(movies.results.map(convertMovie));
            } else {
                setError(true);
            }
        };
        fetchMovies();
    }, [type]);

    return { data, loading, error };
};

export default useMovies;

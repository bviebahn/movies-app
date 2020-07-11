import { useEffect, useState } from "react";

import { Movie } from "./types";
import { convertMovie, fetchTmdb } from "./util";

const useMovies = (
    type: "popular" | "latest" | "now_playing" | "top_rated" | "upcoming"
) => {
    const [data, setData] = useState<ReadonlyArray<Movie>>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchMovies = async () => {
            const response = await fetchTmdb(`/movie/${type}`);

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

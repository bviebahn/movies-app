import { useState, useEffect, useMemo } from "react";
import { TvShow } from "./types";
import { TMDB_BASE_URL, TMDB_ACCESS_TOKEN } from "./constants";
import useGenres from "./useGenres";
import { convertTvShow, addGenres } from "./util";

const useTvShows = (
    type: "popular" | "latest" | "airing_today" | "top_rated" | "on_the_air",
) => {
    const [data, setData] = useState<ReadonlyArray<TvShow>>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { tvGenres } = useGenres();

    useEffect(() => {
        const fetchTvShows = async () => {
            const response = await fetch(`${TMDB_BASE_URL}tv/${type}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
                },
            });

            setLoading(false);
            if (response.ok) {
                const tvShows = await response.json();
                setData(tvShows.results.map(convertTvShow));
            } else {
                setError(true);
            }
        };
        fetchTvShows();
    }, [type]);

    const dataWithGenres = useMemo(
        () => data?.map((movie) => addGenres(movie, tvGenres)),
        [data, tvGenres],
    );

    return { data: dataWithGenres, loading, error };
};

export default useTvShows;

import { useState, useEffect, useMemo } from "react";
import { Movie, Genre } from "./types";
import { TMDB_BASE_URL, TMDB_ACCESS_TOKEN } from "./constants";
import useGenres from "./useGenres";
import { convertMovie } from "./util";

const addMovieGenres = (movie: Movie, genres: ReadonlyArray<Genre>): Movie => ({
    ...movie,
    genres: movie.genreIds.reduce<ReadonlyArray<Genre>>((prev, curr) => {
        const genre = genres.find((g) => g.id === curr);
        return [...prev, ...(genre ? [genre] : [])];
    }, []),
});

const useMovies = (
    type: "popular" | "latest" | "now_playing" | "top_rated" | "upcoming",
) => {
    const [data, setData] = useState<ReadonlyArray<Movie>>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { movieGenres } = useGenres();

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

    const dataWithGenres = useMemo(
        () => data?.map((movie) => addMovieGenres(movie, movieGenres)),
        [data, movieGenres],
    );

    return { data: dataWithGenres, loading, error };
};

export default useMovies;

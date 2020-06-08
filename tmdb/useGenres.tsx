import React, { useState, useEffect, useContext } from "react";
import { Genre } from "./types";
import { TMDB_ACCESS_TOKEN, TMDB_BASE_URL } from "./constants";

// TODO: don't need? genres are in details
const GenreContext = React.createContext<{
    movieGenres: ReadonlyArray<Genre>;
    tvGenres: ReadonlyArray<Genre>;
}>({
    movieGenres: [],
    tvGenres: [],
});

export const GenreProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [movieGenres, setMovieGenres] = useState<ReadonlyArray<Genre>>([]);
    const [tvGenres, setTvGenres] = useState<ReadonlyArray<Genre>>([]);

    useEffect(() => {
        let cancelled = false;
        const fetchMovieGenres = async () => {
            const response = await fetch(`${TMDB_BASE_URL}genre/movie/list`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
                },
            });

            if (response.ok && !cancelled) {
                const result = await response.json();
                setMovieGenres(result.genres);
            }
        };
        const fetchTVGenres = async () => {
            const response = await fetch(`${TMDB_BASE_URL}genre/tv/list`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
                },
            });

            if (response.ok && !cancelled) {
                const result = await response.json();
                setTvGenres(result.genres);
            }
        };
        fetchMovieGenres();
        fetchTVGenres();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <GenreContext.Provider value={{ movieGenres, tvGenres }}>
            {children}
        </GenreContext.Provider>
    );
};

const useGenres = () => useContext(GenreContext);

export default useGenres;

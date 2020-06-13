import React, { useContext, useEffect, useState } from "react";

import { Genre } from "./types";
import { fetchTmdb } from "./util";

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
            const response = await fetchTmdb("genre/movie/list");

            if (response.ok && !cancelled) {
                const result = await response.json();
                setMovieGenres(result.genres);
            }
        };
        const fetchTVGenres = async () => {
            const response = await fetchTmdb("genre/tv/list");

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

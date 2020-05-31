import React, { useContext, useState } from "react";
import { MovieDetails, TmdbMovieDetails } from "./types";
import { TMDB_ACCESS_TOKEN, TMDB_BASE_URL } from "./constants";

type MovieDetailsResult = {
    movieDetails?: MovieDetails;
    loading: boolean;
    error: boolean;
};
type State = Record<number, MovieDetailsResult>;

function convertMovieDetails(details: TmdbMovieDetails): MovieDetails {
    return {
        id: details.id,
        adult: details.adult,
        overview: details.overview,
        popularity: details.popularity,
        video: details.video,
        title: details.title,
        backdropPath: details.backdrop_path,
        genreIds: details.genre_ids,
        genres: [],
        originalLanguage: details.original_language,
        originalTitle: details.original_title,
        posterPath: details.poster_path,
        releaseDate: details.release_date,
        voteAverage: details.vote_average,
        voteCount: details.vote_count,
        status: details.status,
        budget: details.budget,
        homepage: details.homepage,
        imdbId: details.imdb_id,
        runtime: details.runtime,
        tagline: details.tagline,
    };
}

type ContextType = {
    useMovieDetails: (id: number) => MovieDetailsResult;
};

const MovieDetailsContext = React.createContext<ContextType>({
    useMovieDetails: () => ({ loading: false, error: false }),
});

export const MovieDetailsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, setState] = useState<State>({});
    const fetchMovieDetails = async (id: number) => {
        console.log("fetch details", id);

        const response = await fetch(`${TMDB_BASE_URL}movie/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
            },
        });

        if (response.ok) {
            const result = await response.json();
            setState((prev) => ({
                ...prev,
                [id]: {
                    movieDetails: convertMovieDetails(result),
                    loading: false,
                    error: false,
                },
            }));
        } else {
            setState((prev) => ({
                ...prev,
                [id]: {
                    loading: false,
                    error: true,
                },
            }));
        }
    };

    const useMovieDetails = (id: number) => {
        if (state[id]) {
            return state[id];
        }

        setState((prev) => ({
            ...prev,
            [id]: {
                loading: true,
                error: false,
            },
        }));

        fetchMovieDetails(id);
        return {
            loading: true,
            error: false,
        };
    };

    return (
        <MovieDetailsContext.Provider value={{ useMovieDetails }}>
            {children}
        </MovieDetailsContext.Provider>
    );
};

const useMovieDetails = (id: number) =>
    useContext(MovieDetailsContext).useMovieDetails(id);

export default useMovieDetails;

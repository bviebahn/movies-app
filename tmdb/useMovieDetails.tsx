import React, { useContext, useReducer } from "react";
import { MovieDetails, TmdbMovieDetails, Credits, TmdbCredits } from "./types";
import { TMDB_ACCESS_TOKEN, TMDB_BASE_URL } from "./constants";

type MovieDetailsResult = {
    movieDetails?: MovieDetails;
    loading: boolean;
    credits?: Credits;
    creditsLoading: boolean;
};

type State = {
    [id: number]: MovieDetailsResult;
};

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

function convertCredits(credits: TmdbCredits): Credits {
    const interestingJobs = ["Director", "Writer", "Producer", "Creator"];
    return {
        id: credits.id,
        cast: credits.cast.map((c) => ({
            castId: c.cast_id,
            character: c.character,
            creditId: c.credit_id,
            id: c.id,
            name: c.name,
            order: c.order,
            gender: c.gender,
            profilePath: c.profile_path,
        })),
        crew: credits.crew
            .filter((c) => interestingJobs.includes(c.job))
            .map((c) => ({
                creditId: c.credit_id,
                department: c.department,
                id: c.id,
                job: c.job,
                name: c.name,
                gender: c.gender,
                profilePath: c.profile_path,
            })),
    };
}

type ContextType = {
    useMovieDetails: (id: number) => MovieDetailsResult;
};

const MovieDetailsContext = React.createContext<ContextType | undefined>(
    undefined,
);

type Action =
    | { type: "LOAD_DETAILS_START"; payload: number }
    | { type: "LOAD_DETAILS_FINISH"; payload: MovieDetails }
    | { type: "LOAD_CREDITS_FINISH"; payload: Credits };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "LOAD_DETAILS_START":
            return {
                ...state,
                [action.payload]: {
                    loading: true,
                    creditsLoading: true,
                },
            };
        case "LOAD_DETAILS_FINISH":
            return {
                ...state,
                [action.payload.id]: {
                    ...state[action.payload.id],
                    movieDetails: action.payload,
                    loading: false,
                },
            };
        case "LOAD_CREDITS_FINISH":
            return {
                ...state,
                [action.payload.id]: {
                    ...state[action.payload.id],
                    creditsLoading: false,
                    credits: action.payload,
                },
            };
    }
}

export const MovieDetailsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(reducer, {});

    const fetchDetails = async (id: number) => {
        const response = await fetch(`${TMDB_BASE_URL}movie/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
            },
        });

        if (response.ok) {
            const result = await response.json();
            dispatch({
                type: "LOAD_DETAILS_FINISH",
                payload: convertMovieDetails(result),
            });
        }
    };

    const fetchCredits = async (id: number) => {
        const response = await fetch(`${TMDB_BASE_URL}movie/${id}/credits`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
            },
        });

        if (response.ok) {
            const result = await response.json();
            dispatch({
                type: "LOAD_CREDITS_FINISH",
                payload: convertCredits(result),
            });
        }
    };

    const fetchMovieDetails = (id: number) => {
        dispatch({ type: "LOAD_DETAILS_START", payload: id });
        fetchDetails(id);
        fetchCredits(id);
    };

    const useMovieDetails = (id: number) => {
        if (state[id]) {
            return state[id];
        }

        fetchMovieDetails(id);

        return {
            loading: true,
            creditsLoading: true,
        };
    };

    return (
        <MovieDetailsContext.Provider value={{ useMovieDetails }}>
            {children}
        </MovieDetailsContext.Provider>
    );
};

const useMovieDetails = (id: number) => {
    const context = useContext(MovieDetailsContext);
    if (!context) {
        throw new Error(
            "useMovieDetails must be used within a MovieDetailsProvider",
        );
    }
    return context.useMovieDetails(id);
};

export default useMovieDetails;

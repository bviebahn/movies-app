import React, { useContext, useReducer } from "react";

import { MovieDetails, TmdbMovieDetails } from "./types";
import useUser from "./useUser";
import { convertCredits, convertMovie, fetchTmdb } from "./util";

type MovieDetailsResult = {
    movieDetails?: MovieDetails;
    loading: boolean;
    error: boolean;
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
        genres: details.genres,
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
        credits: convertCredits(details.credits),
        reviews: details.reviews.results,
        recommendations: details.recommendations.results.map(convertMovie),
        accountStates: {
            favorite: !!details.account_states?.favorite,
            rated: details.account_states?.rated
                ? details.account_states.rated.value
                : 0,
            watchlist: !!details.account_states?.watchlist,
        },
    };
}

/** updates cache and returns function that reverts to state before update */
type UpdateCacheFunction = (details: MovieDetails) => () => void;

type ContextType = {
    useMovieDetails: (id: number) => MovieDetailsResult;
    updateCache: UpdateCacheFunction;
};

const MovieDetailsContext = React.createContext<ContextType | undefined>(
    undefined,
);

type Action =
    | { type: "LOAD_DETAILS_START"; payload: number }
    | { type: "LOAD_DETAILS_FINISH"; payload: MovieDetails }
    | { type: "LOAD_DETAILS_ERROR"; payload: number }
    | {
          type: "UPDATE_CACHE";
          payload: { id: number; details: MovieDetails | undefined };
      };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "LOAD_DETAILS_START":
            return {
                ...state,
                [action.payload]: {
                    loading: true,
                    error: false,
                },
            };
        case "LOAD_DETAILS_FINISH":
            return {
                ...state,
                [action.payload.id]: {
                    movieDetails: action.payload,
                    loading: false,
                    error: false,
                },
            };
        case "LOAD_DETAILS_ERROR":
            return {
                ...state,
                [action.payload]: {
                    loading: false,
                    error: true,
                },
            };
        case "UPDATE_CACHE":
            return {
                ...state,
                [action.payload.id]: {
                    movieDetails: action.payload.details,
                    loading: false,
                    error: false,
                },
            };
    }
}

export const MovieDetailsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(reducer, {});
    const { sessionId } = useUser();

    const fetchMovieDetails = async (id: number) => {
        dispatch({ type: "LOAD_DETAILS_START", payload: id });
        const response = await fetchTmdb(
            `movie/${id}?append_to_response=credits,reviews,recommendations${
                sessionId ? `,account_states&session_id=${sessionId}` : ""
            }`,
        );

        if (response.ok) {
            const result = await response.json();
            dispatch({
                type: "LOAD_DETAILS_FINISH",
                payload: convertMovieDetails(result),
            });
        } else {
            dispatch({
                type: "LOAD_DETAILS_ERROR",
                payload: id,
            });
        }
    };

    const useMovieDetails = (id: number): MovieDetailsResult => {
        if (state[id]) {
            return state[id];
        }

        fetchMovieDetails(id);

        return {
            loading: true,
            error: false,
        };
    };

    const updateCache: UpdateCacheFunction = (details) => {
        const id = details.id;
        const oldDetails = state[id].movieDetails;
        dispatch({
            type: "UPDATE_CACHE",
            payload: { id: details.id, details },
        });
        return () =>
            dispatch({
                type: "UPDATE_CACHE",
                payload: { id, details: oldDetails },
            });
    };

    return (
        <MovieDetailsContext.Provider value={{ useMovieDetails, updateCache }}>
            {children}
        </MovieDetailsContext.Provider>
    );
};

const useMovieDetails = (
    id: number,
): MovieDetailsResult & { updateCache: UpdateCacheFunction } => {
    const context = useContext(MovieDetailsContext);
    if (!context) {
        throw new Error(
            "useMovieDetails must be used within a MovieDetailsProvider",
        );
    }
    const details = context.useMovieDetails(id);

    return { ...details, updateCache: context.updateCache };
};

export default useMovieDetails;

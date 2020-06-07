import React, { useContext, useReducer } from "react";
import { MovieDetails, TmdbMovieDetails, Credits, TmdbCredits } from "./types";
import { TMDB_ACCESS_TOKEN, TMDB_BASE_URL } from "./constants";
import { convertMovie } from "./util";

type MovieDetailsResult = {
    movieDetails?: MovieDetails;
    loading: boolean;
    error: boolean;
};

type State = {
    [id: number]: MovieDetailsResult;
};

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
        credits: convertCredits(details.credits),
        reviews: details.reviews.results,
        recommendations: details.recommendations.results.map(convertMovie),
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
    | { type: "LOAD_DETAILS_ERROR"; payload: number };

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
    }
}

export const MovieDetailsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(reducer, {});

    const fetchMovieDetails = async (id: number) => {
        dispatch({ type: "LOAD_DETAILS_START", payload: id });
        const response = await fetch(
            `${TMDB_BASE_URL}movie/${id}?append_to_response=credits,reviews,recommendations`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
                },
            },
        );

        if (response.ok) {
            const result = await response.json();
            console.log("result", result);

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

    return (
        <MovieDetailsContext.Provider value={{ useMovieDetails }}>
            {children}
        </MovieDetailsContext.Provider>
    );
};

const useMovieDetails = (id: number): MovieDetailsResult => {
    const context = useContext(MovieDetailsContext);
    if (!context) {
        throw new Error(
            "useMovieDetails must be used within a MovieDetailsProvider",
        );
    }
    return context.useMovieDetails(id);
};

export default useMovieDetails;

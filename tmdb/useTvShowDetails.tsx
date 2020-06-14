import React, { useContext, useReducer } from "react";

import { TmdbTvShowDetails, TvShowDetails } from "./types";
import { convertCredits, convertTvShow, fetchTmdb } from "./util";

type TvShowDetailsResult = {
    tvShowDetails?: TvShowDetails;
    loading: boolean;
    error: boolean;
};

type State = {
    [id: number]: TvShowDetailsResult;
};

function convertTvShowDetails(details: TmdbTvShowDetails): TvShowDetails {
    return {
        id: details.id,
        overview: details.overview,
        popularity: details.popularity,
        name: details.name,
        backdropPath: details.backdrop_path,
        genreIds: details.genre_ids,
        genres: details.genres,
        originalLanguage: details.original_language,
        originalName: details.original_name,
        posterPath: details.poster_path,
        firstAirDate: details.first_air_date,
        voteAverage: details.vote_average,
        voteCount: details.vote_count,
        status: details.status,
        homepage: details.homepage,
        episodeRunTime: details.episode_run_time[0],
        createdBy: details.created_by.map((c) => ({
            creditId: c.credit_id,
            gender: c.gender,
            id: c.id,
            name: c.name,
            profilePath: c.profile_path,
        })),
        inProduction: details.in_production,
        languages: details.languages,
        numberOfEpisodes: details.number_of_episodes,
        numberOfSeasons: details.number_of_seasons,
        originCountry: details.origin_country,
        seasons: details.seasons.map((s) => ({
            airDate: s.air_date,
            episodeCount: s.episode_count,
            id: s.id,
            name: s.name,
            overview: s.overview,
            posterPath: s.poster_path,
            seasonNumber: s.season_number,
        })),
        type: details.type,
        credits: convertCredits(details.credits),
        reviews: details.reviews.results,
        recommendations: details.recommendations.results.map(convertTvShow),
        accountStates: {
            favorite: !!details.account_states?.favorite,
            rated: details.account_states?.rated
                ? details.account_states.rated.value
                : 0,
            watchlist: !!details.account_states?.watchlist,
        },
    };
}

type ContextType = {
    useTvShowDetails: (id: number) => TvShowDetailsResult;
};

const TvShowDetailsContext = React.createContext<ContextType | undefined>(
    undefined,
);

type Action =
    | { type: "LOAD_DETAILS_START"; payload: number }
    | { type: "LOAD_DETAILS_FINISH"; payload: TvShowDetails }
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
                    tvShowDetails: action.payload,
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

export const TvShowDetailsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(reducer, {});

    const fetchTvShowDetails = async (id: number) => {
        dispatch({ type: "LOAD_DETAILS_START", payload: id });
        const response = await fetchTmdb(
            `tv/${id}?append_to_response=credits,reviews,recommendations`,
        );

        if (response.ok) {
            const result = await response.json();
            dispatch({
                type: "LOAD_DETAILS_FINISH",
                payload: convertTvShowDetails(result),
            });
        } else {
            dispatch({
                type: "LOAD_DETAILS_ERROR",
                payload: id,
            });
        }
    };

    const useTvShowDetails = (id: number): TvShowDetailsResult => {
        if (state[id]) {
            return state[id];
        }

        fetchTvShowDetails(id);

        return {
            loading: true,
            error: false,
        };
    };

    return (
        <TvShowDetailsContext.Provider value={{ useTvShowDetails }}>
            {children}
        </TvShowDetailsContext.Provider>
    );
};

const useTvShowDetails = (id: number): TvShowDetailsResult => {
    const context = useContext(TvShowDetailsContext);
    if (!context) {
        throw new Error(
            "useTvShowDetails must be used within a TvShowDetailsProvider",
        );
    }
    return context.useTvShowDetails(id);
};

export default useTvShowDetails;

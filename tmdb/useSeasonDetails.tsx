import React, { useContext, useReducer } from "react";

import { TMDB_ACCESS_TOKEN, TMDB_BASE_URL } from "./constants";
import { SeasonDetails, TmdbSeasonDetails } from "./types";

type SeasonDetailsResult = {
    seasonDetails?: SeasonDetails;
    loading: boolean;
    error: boolean;
};

type State = {
    [id: string]: SeasonDetailsResult;
};

function convertSeasonDetails(details: TmdbSeasonDetails): SeasonDetails {
    return {
        id: details.id,
        overview: details.overview,
        name: details.name,
        posterPath: details.poster_path,
        airDate: details.air_date,
        seasonNumber: details.season_number,
        episodes: details.episodes.map((e) => ({
            airDate: e.air_date,
            guestStars: e.guest_stars,
            id: e.id,
            name: e.name,
            overview: e.overview,
            seasonNumber: e.season_number,
            voteAverage: e.vote_average,
            voteCount: e.vote_count,
            productionCode: e.production_code,
            episodeNumber: e.episode_number,
            stillPath: e.still_path,
        })),
    };
}

type ContextType = {
    useSeasonDetails: (id: number, seasonNumber: number) => SeasonDetailsResult;
};

const SeasonDetailsContext = React.createContext<ContextType | undefined>(
    undefined,
);

type Action =
    | { type: "LOAD_DETAILS_START"; payload: string }
    | {
          type: "LOAD_DETAILS_FINISH";
          payload: { id: string; details: SeasonDetails };
      }
    | { type: "LOAD_DETAILS_ERROR"; payload: string };

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
                    seasonDetails: action.payload.details,
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

export const SeasonDetailsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(reducer, {});

    const fetchSeasonDetails = async (id: number, seasonNumber: number) => {
        const uniqueId = `${id}:${seasonNumber}`;
        dispatch({
            type: "LOAD_DETAILS_START",
            payload: uniqueId,
        });
        const response = await fetch(
            `${TMDB_BASE_URL}tv/${id}/season/${seasonNumber}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
                },
            },
        );

        if (response.ok) {
            const result = await response.json();
            console.log("seasondetails", result);

            dispatch({
                type: "LOAD_DETAILS_FINISH",
                payload: {
                    id: uniqueId,
                    details: convertSeasonDetails(result),
                },
            });
        } else {
            dispatch({
                type: "LOAD_DETAILS_ERROR",
                payload: uniqueId,
            });
        }
    };

    const useSeasonDetails = (
        id: number,
        seasonNumber: number,
    ): SeasonDetailsResult => {
        const uniqueId = `${id}:${seasonNumber}`;
        if (state[uniqueId]) {
            return state[uniqueId];
        }

        fetchSeasonDetails(id, seasonNumber);

        return {
            loading: true,
            error: false,
        };
    };

    return (
        <SeasonDetailsContext.Provider value={{ useSeasonDetails }}>
            {children}
        </SeasonDetailsContext.Provider>
    );
};

const useSeasonDetails = (
    id: number,
    seasonNumber: number,
): SeasonDetailsResult => {
    const context = useContext(SeasonDetailsContext);
    if (!context) {
        throw new Error(
            "useSeasonDetails must be used within a SeasonDetailsProvider",
        );
    }
    return context.useSeasonDetails(id, seasonNumber);
};

export default useSeasonDetails;

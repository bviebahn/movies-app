import React, { useContext, useEffect, useReducer, useState } from "react";

import {
    Movie,
    Person,
    TmdbMovie,
    TmdbPerson,
    TmdbTvShow,
    TvShow,
} from "./types";
import { convertSearchResult, fetchTmdb } from "./util";

type TmdbSearchResult = {
    page: number;
    total_results: number;
    total_pages: number;
    results: ReadonlyArray<
        | (TmdbMovie & { media_type: "movie" })
        | (TmdbTvShow & { media_type: "tv" })
        | (TmdbPerson & { media_type: "person" })
    >;
};

export type SearchResultItem =
    | (Movie & { mediaType: "movie" })
    | (TvShow & { mediaType: "tv" })
    | (Person & { mediaType: "person" });

type SearchResult = {
    results: ReadonlyArray<SearchResultItem>;
    totalResults: number;
};

type SearchState = {
    data?: SearchResult;
    loading: boolean;
    page: number;
};

type SearchContextType = {
    useSearch: (query?: string) => SearchState & { fetchMore: () => void };
};

const SearchContext = React.createContext<SearchContextType | undefined>(
    undefined,
);

type Action =
    | { type: "FETCH_SEARCH_START" }
    | { type: "FETCH_SEARCH_FINISHED"; payload: SearchResult }
    | { type: "RESET_SEARCH" }
    | { type: "LOAD_MORE" }
    | { type: "LOAD_MORE_FINISHED"; payload: SearchResult };

const initialState: SearchState = {
    loading: false,
    page: 1,
};

function reducer(state: SearchState, action: Action): SearchState {
    switch (action.type) {
        case "FETCH_SEARCH_START":
            return { ...state, loading: true };
        case "FETCH_SEARCH_FINISHED":
            return {
                ...state,
                data: action.payload,
                loading: false,
            };
        case "RESET_SEARCH":
            return initialState;
        case "LOAD_MORE":
            return { ...state, page: state.page + 1, loading: true };
        case "LOAD_MORE_FINISHED":
            return {
                ...state,
                data: {
                    ...action.payload,
                    results: [
                        ...(state.data?.results || []),
                        ...action.payload.results,
                    ],
                },
                loading: false,
            };
    }
}

async function fetchSearch(queryParam: string, page: number = 1) {
    const response = await fetchTmdb(
        `search/multi?query=${queryParam}&page=${page}`,
    );

    if (response.ok) {
        const result: TmdbSearchResult = await response.json();
        return convertSearchResult(result);
    }

    return undefined;
}

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [query, setQuery] = useState<string>();

    const fetchMore = () => {
        dispatch({ type: "LOAD_MORE" });
    };

    const { page } = state;

    useEffect(() => {
        if (query) {
            dispatch({ type: "FETCH_SEARCH_START" });
            (async () => {
                const result = await fetchSearch(query, page);
                if (result) {
                    dispatch({
                        type:
                            page > 1
                                ? "LOAD_MORE_FINISHED"
                                : "FETCH_SEARCH_FINISHED",
                        payload: result,
                    });
                }
            })();
        } else {
            dispatch({ type: "RESET_SEARCH" });
        }
    }, [query, page]);

    const useSearch = (
        queryParam?: string,
    ): SearchState & { fetchMore: () => void } => {
        setQuery(queryParam);

        if (state) {
            return { ...state, fetchMore };
        }

        return {
            loading: false,
            page: 1,
            fetchMore,
        };
    };

    return (
        <SearchContext.Provider value={{ useSearch }}>
            {children}
        </SearchContext.Provider>
    );
};

const useSearch = (query?: string): SearchState & { fetchMore: () => void } => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("useSearch must be used within a SearchProvider");
    }
    return context.useSearch(query);
};

export default useSearch;

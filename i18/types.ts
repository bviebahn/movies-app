export type SubstituteTranslation<Data> = (data: Data) => string;

export type Translations = {
    REVIEWS: string;
    CAST: string;
    POPULAR_MOVIES: string;
    POPULAR_TV_SHOWS: string;
    BY: SubstituteTranslation<{ name: string }>;
    READ_MORE: string;
    RECOMMENDATIONS: string;
    SEARCH: string;
    ORIGINAL_LANGUAGE: string;
    GENRES: string;
    SEASONS: string;
    EPISODES: string;
    CREATOR: SubstituteTranslation<{ n: number }>;
    MOVIE_GENRES: string;
    TV_GENRES: string;
    SIGNIN_TEXT: string;
    SUBMITTED: string;
    LOGIN: string;
    LOGOUT: string;
    FAVORITES: string;
    WATCHLIST: string;
    RATED: string;
    MOVIES: string;
    TV_SHOWS: string;
    ACCOUNT_LIST_TITLE: SubstituteTranslation<{
        type: "favorites" | "watchlist" | "rated" | "recommendations";
        mediaType: "movie" | "tv";
    }>;
};

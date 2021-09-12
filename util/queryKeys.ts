import { AccountListType } from "../tmdb/useAccountList";
import type { MovieListType } from "../tmdb/useMovies";
import type { TvShowListType } from "../tmdb/useTvShows";

const QueryKeys = {
    Configuration: "configuration",
    Genres: (type: "movie" | "tv") => ["genres", type],
    MovieDetails: (id: number, sessionId: string | undefined) => [
        "movie-details",
        id,
        sessionId,
    ],
    Movies: (type: MovieListType) => ["movies", type],
    TvShows: (type: TvShowListType) => ["tv-shows", type],
    PersonDetails: (id: number) => ["person-details", id],
    SeasonDetails: (
        id: number,
        seasonNumber: number,
        sessionId: string | undefined
    ) => ["season-details", id, seasonNumber, sessionId],
    TvDetails: (id: number, sessionId: string | undefined) => [
        "tv-details",
        id,
        sessionId,
    ],
    User: (sessionId: string | undefined) => ["user", sessionId],
    Search: (query: string) => ["search", query],
    AccountLists: (
        accountId: string | undefined,
        accessToken: string | undefined
    ) => ["account-lists", accountId, accessToken],
    AccountList: (
        accountId: string | undefined,
        type: AccountListType,
        mediaType: "movie" | "tv",
        accessToken: string | undefined
    ) => ["account-list", accountId, type, mediaType, accessToken],
};

export default QueryKeys;

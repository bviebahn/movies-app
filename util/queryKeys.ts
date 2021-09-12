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
};

export default QueryKeys;

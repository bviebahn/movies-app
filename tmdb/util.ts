import {
    TmdbMovie,
    Movie,
    TmdbTvShow,
    TvShow,
    Genre,
    TmdbCredits,
    Credits,
    TmdbSearchResult,
    SearchResult,
    TmdbPerson,
    Person,
    TmdbAccount,
    Account,
} from "./types";
import { TMDB_BASE_URL, TMDB_ACCESS_TOKEN } from "./constants";

export function fetchTmdb(
    path: string,
    options?: { method?: string; version?: number; body?: any },
) {
    const method = options?.method || "GET";
    const version = options?.version || 3;
    return fetch(`${TMDB_BASE_URL}${version}${path}`, {
        method: method,
        headers: {
            Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
        },
        ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
    });
}

export function addGenres<T extends { genreIds: ReadonlyArray<number> }>(
    obj: T,
    genres: ReadonlyArray<Genre>,
): T & { genres: ReadonlyArray<Genre> } {
    return {
        ...obj,
        genres: obj.genreIds.reduce<ReadonlyArray<Genre>>((prev, curr) => {
            const genre = genres.find((g) => g.id === curr);
            return [...prev, ...(genre ? [genre] : [])];
        }, []),
    };
}

export function convertMovie(movie: TmdbMovie): Movie {
    return {
        id: movie.id,
        adult: movie.adult,
        overview: movie.overview,
        popularity: movie.popularity,
        video: movie.video,
        title: movie.title,
        backdropPath: movie.backdrop_path,
        genreIds: movie.genre_ids,
        originalLanguage: movie.original_language,
        originalTitle: movie.original_title,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
        voteCount: movie.vote_count,
    };
}

export function convertTvShow(tv: TmdbTvShow): TvShow {
    return {
        firstAirDate: tv.first_air_date,
        genreIds: tv.genre_ids,
        id: tv.id,
        name: tv.name,
        originCountry: tv.origin_country,
        originalLanguage: tv.original_language,
        originalName: tv.original_name,
        overview: tv.overview,
        popularity: tv.popularity,
        voteAverage: tv.vote_average,
        voteCount: tv.vote_count,
        backdropPath: tv.backdrop_path,
        posterPath: tv.poster_path,
    };
}

export function convertCredits(credits: TmdbCredits): Credits {
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

export function convertPerson(person: TmdbPerson): Person {
    return {
        adult: person.adult,
        id: person.id,
        knownFor: person.known_for.map((i) =>
            i.media_type === "movie"
                ? { ...convertMovie(i), mediaType: "movie" }
                : { ...convertTvShow(i), mediaType: "tv" },
        ),
        name: person.name,
        popularity: person.popularity,
        profilePath: person.profile_path,
    };
}

export function convertSearchResult(result: TmdbSearchResult): SearchResult {
    return {
        totalResults: result.total_results,
        results: result.results.map((r) => {
            if (r.media_type === "movie") {
                return { ...convertMovie(r), mediaType: "movie" };
            }

            if (r.media_type === "tv") {
                return { ...convertTvShow(r), mediaType: "tv" };
            }

            return { ...convertPerson(r), mediaType: "person" };
        }),
    };
}

export function convertAccount(result: TmdbAccount): Account {
    return {
        avatar: result.avatar,
        countryCode: result.iso_3166_1,
        languageCode: result.iso_639_1,
        id: result.id,
        includeAdult: result.include_adult,
        username: result.username,
    };
}

export function getGravatarImageUrl(hash: string) {
    return `https://secure.gravatar.com/avatar/${hash}.jpg?s=64&d=mp`;
}

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
    TmdbListResult,
    ListResult,
    TmdbPersonDetails,
    PersonDetails,
    TmdbAccountList,
    AccountList,
} from "./types";
import { TMDB_BASE_URL, TMDB_ACCESS_TOKEN } from "./constants";

export function fetchTmdb(
    path: string,
    options?: {
        method?: string;
        version?: 3 | 4;
        accessToken?: string;
        body?: any;
    },
) {
    const method = options?.method || "GET";
    const version = options?.version || 3;
    const accessToken = options?.accessToken || TMDB_ACCESS_TOKEN;
    return fetch(`${TMDB_BASE_URL}${version}${path}`, {
        method: method,
        headers: {
            Authorization: `Bearer ${accessToken}`,
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
        mediaType: "movie",
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
        mediaType: "tv",
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
        mediaType: "person",
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
        page: result.page,
        totalResults: result.total_results,
        totalPages: result.total_pages,
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

export function convertListResult<T, V>(
    result: TmdbListResult<T>,
    convertFn: (element: T) => V,
): ListResult<V> {
    return {
        page: result.page,
        totalResults: result.total_results,
        totalPages: result.total_pages,
        results: result.results.map(convertFn),
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

export function convertPersonDetails(person: TmdbPersonDetails): PersonDetails {
    return {
        mediaType: "person",
        id: person.id,
        adult: person.adult,
        alsoKnownAs: person.also_known_as,
        biography: person.biography,
        gender: person.gender,
        imdbId: person.imdb_id,
        knownForDepartment: person.known_for_department,
        name: person.name,
        popularity: person.popularity,
        birthday: person.birthday,
        deathday: person.deathday,
        homepage: person.homepage,
        placeOfBirth: person.place_of_birth,
        profilePath: person.profile_path,
        credits: [
            ...person.combined_credits.cast.map((c) =>
                c.media_type === "movie"
                    ? {
                          ...convertMovie(c),
                          character: c.character,
                          creditId: c.credit_id,
                          creditType: "cast" as "cast",
                      }
                    : {
                          ...convertTvShow(c),
                          character: c.character,
                          creditId: c.credit_id,
                          episodeCount: c.episode_count,
                          creditType: "cast" as "cast",
                      },
            ),
            ...person.combined_credits.crew.map((c) =>
                c.media_type === "movie"
                    ? {
                          ...convertMovie(c),
                          job: c.job,
                          creditId: c.credit_id,
                          creditType: "crew" as "crew",
                      }
                    : {
                          ...convertTvShow(c),
                          job: c.job,
                          creditId: c.credit_id,
                          episodeCount: c.episode_count,
                          creditType: "crew" as "crew",
                      },
            ),
        ],
    };
}

export function convertAccountLists(
    accountLists: ReadonlyArray<TmdbAccountList>,
): ReadonlyArray<AccountList> {
    return accountLists.map((v) => ({
        adult: v.adult,
        averageRating: v.average_rating,
        countryCode: v.iso_3166_1,
        languageCode: v.iso_639_1,
        createdAt: v.created_at,
        description: v.description,
        featured: v.featured,
        id: v.id,
        name: v.name,
        numberOfItems: v.number_of_items,
        public: v.public,
        revenue: v.revenue,
        runtime: v.runtime,
        sortBy: v.sort_by,
        updatedAt: v.updated_at,
        backdropPath: v.backdrop_path,
        posterPath: v.poster_path,
    }));
}

export function getGravatarImageUrl(hash: string) {
    return `https://secure.gravatar.com/avatar/${hash}.jpg?s=64&d=mp`;
}

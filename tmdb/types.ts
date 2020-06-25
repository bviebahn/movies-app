export type TmdbMovie = {
    id: number;
    adult: boolean;
    backdrop_path?: string;
    genre_ids: ReadonlyArray<number>;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path?: string;
    release_date?: string;
    title: string;
    video: false;
    vote_average: number;
    vote_count: number;
};

export type Movie = {
    id: number;
    mediaType: "movie";
    adult: boolean;
    backdropPath?: string;
    genreIds: ReadonlyArray<number>;
    originalLanguage: string;
    originalTitle: string;
    overview: string;
    popularity: number;
    posterPath?: string;
    releaseDate?: string;
    title: string;
    video: false;
    voteAverage: number;
    voteCount: number;
};

export type TmdbMovieDetails = TmdbMovie & {
    budget: number;
    genres: ReadonlyArray<Genre>;
    homepage?: string;
    imdb_id?: string;
    runtime?: number;
    status: string;
    tagline?: string;
    credits: TmdbCredits;
    reviews: {
        id: number;
        page: number;
        total_pages: number;
        total_results: number;
        results: ReadonlyArray<Review>;
    };
    recommendations: { results: ReadonlyArray<TmdbMovie> };
    account_states?: {
        favorite: boolean;
        rated: false | { value: number };
        watchlist: boolean;
    };
};

export type MovieDetails = Movie & {
    budget: number;
    genres: ReadonlyArray<Genre>;
    homepage?: string;
    imdbId?: string;
    runtime?: number;
    status: string;
    tagline?: string;
    credits: Credits;
    reviews: ReadonlyArray<Review>;
    recommendations: ReadonlyArray<Movie>;
    accountStates: {
        favorite: boolean;
        rated: number;
        watchlist: boolean;
    };
};

export type TmdbTvShow = {
    poster_path?: string;
    popularity: number;
    id: number;
    backdrop_path?: string;
    vote_average: number;
    overview: string;
    first_air_date?: string;
    origin_country: ReadonlyArray<string>;
    genre_ids: ReadonlyArray<number>;
    original_language: string;
    vote_count: number;
    name: string;
    original_name: string;
};

export type TvShow = {
    posterPath?: string;
    popularity: number;
    id: number;
    mediaType: "tv";
    backdropPath?: string;
    voteAverage: number;
    overview: string;
    firstAirDate?: string;
    originCountry: ReadonlyArray<string>;
    genreIds: ReadonlyArray<number>;
    originalLanguage: string;
    voteCount: number;
    name: string;
    originalName: string;
};

export type TmdbTvShowDetails = TmdbTvShow & {
    created_by: ReadonlyArray<{
        id: number;
        credit_id: string;
        name: string;
        gender: number;
        profile_path: string;
    }>;
    episode_run_time: ReadonlyArray<number>;
    genres: ReadonlyArray<Genre>;
    homepage: string;
    in_production: boolean;
    languages: ReadonlyArray<string>;
    number_of_episodes: number;
    number_of_seasons: number;
    seasons: ReadonlyArray<TmdbSeason>;
    status: string;
    type: string;
    vote_average: number;
    vote_count: number;
    credits: TmdbCredits;
    reviews: {
        id: number;
        page: number;
        total_pages: number;
        total_results: number;
        results: ReadonlyArray<Review>;
    };
    recommendations: { results: ReadonlyArray<TmdbTvShow> };
    account_states?: {
        favorite: boolean;
        rated: false | { value: number };
        watchlist: boolean;
    };
};

export type TvShowDetails = TvShow & {
    createdBy: ReadonlyArray<{
        id: number;
        creditId: string;
        name: string;
        gender: number;
        profilePath: string;
    }>;
    episodeRunTime: number;
    genres: ReadonlyArray<Genre>;
    homepage: string;
    inProduction: boolean;
    languages: ReadonlyArray<string>;
    numberOfEpisodes: number;
    numberOfSeasons: number;
    seasons: ReadonlyArray<Season>;
    status: string;
    type: string;
    voteAverage: number;
    voteCount: number;
    credits: Credits;
    reviews: ReadonlyArray<Review>;
    recommendations: ReadonlyArray<TvShow>;
    accountStates: {
        favorite: boolean;
        rated: number;
        watchlist: boolean;
    };
};

export type TmdbSeason = {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path?: string;
    season_number: number;
};

export type Season = {
    airDate: string;
    episodeCount: number;
    id: number;
    name: string;
    overview: string;
    posterPath?: string;
    seasonNumber: number;
};

export type TmdbSeasonDetails = {
    air_date: string;
    id: number;
    name: string;
    overview: string;
    poster_path?: string;
    season_number: number;
    episodes: ReadonlyArray<TmdbEpisode>;
    account_states?: {
        results: ReadonlyArray<{
            id: number;
            episode_number: number;
            rated: false | { value: number };
        }>;
    };
};

export type SeasonDetails = {
    airDate: string;
    id: number;
    name: string;
    overview: string;
    posterPath?: string;
    seasonNumber: number;
    episodes: ReadonlyArray<Episode>;
    accountStates?: ReadonlyArray<{
        id: number;
        epiodeNumber: number;
        rated: number;
    }>;
};

export type TmdbEpisode = {
    air_date: string;
    episode_number: number;
    guest_stars: ReadonlyArray<any>;
    name: string;
    overview: string;
    id: number;
    production_code?: string;
    season_number: number;
    still_path?: string;
    vote_average: number;
    vote_count: number;
};

export type Episode = {
    airDate: string;
    episodeNumber: number;
    guestStars: ReadonlyArray<any>;
    name: string;
    overview: string;
    id: number;
    productionCode?: string;
    seasonNumber: number;
    stillPath?: string;
    voteAverage: number;
    voteCount: number;
};

export type Genre = {
    id: number;
    name: string;
};

export type TmdbCredits = {
    id: number;
    cast: ReadonlyArray<{
        cast_id: number;
        character: string;
        credit_id: string;
        gender?: number;
        id: number;
        name: string;
        order: number;
        profile_path?: string;
    }>;
    crew: ReadonlyArray<{
        credit_id: string;
        department: string;
        gender?: number;
        id: number;
        job: string;
        name: string;
        profile_path?: string;
    }>;
};

export type Credits = {
    id: number;
    cast: ReadonlyArray<{
        castId: number;
        character: string;
        creditId: string;
        gender?: number;
        id: number;
        name: string;
        order: number;
        profilePath?: string;
    }>;
    crew: ReadonlyArray<{
        creditId: string;
        department: string;
        gender?: number;
        id: number;
        job: string;
        name: string;
        profilePath?: string;
    }>;
};

export type Review = {
    id: string;
    author: string;
    content: string;
    url: string;
};

export type TmdbConfiguration = {
    images: {
        base_url: string;
        secure_base_url: string;
        backdrop_sizes: ReadonlyArray<string>;
        logo_sizes: ReadonlyArray<string>;
        poster_sizes: ReadonlyArray<string>;
        profile_sizes: ReadonlyArray<string>;
        still_sizes: ReadonlyArray<string>;
    };
};

export type Configuration = {
    images: {
        baseUrl: string;
        secureBaseUrl: string;
        backdropSizes: ReadonlyArray<string>;
        logoSizes: ReadonlyArray<string>;
        posterSizes: ReadonlyArray<string>;
        profileSizes: ReadonlyArray<string>;
        stillSizes: ReadonlyArray<string>;
    };
};

export type TmdbPerson = {
    profile_path?: string;
    adult: boolean;
    id: number;
    known_for: ReadonlyArray<
        | (TmdbMovie & { media_type: "movie" })
        | (TmdbTvShow & { media_type: "tv" })
    >;
    name: string;
    popularity: number;
};

export type Person = {
    mediaType: "person";
    profilePath?: string;
    adult: boolean;
    id: number;
    knownFor: ReadonlyArray<Movie | TvShow>;
    name: string;
    popularity: number;
};

type TmdbPersonCredits = {
    cast: ReadonlyArray<
        (
            | (TmdbMovie & { media_type: "movie" })
            | (TmdbTvShow & { episode_count: number; media_type: "tv" })
        ) & {
            character: string;
            credit_id: string;
        }
    >;
    crew: ReadonlyArray<
        (
            | (TmdbMovie & { media_type: "movie" })
            | (TmdbTvShow & { episode_count: number; media_type: "tv" })
        ) & {
            job: string;
            credit_id: string;
        }
    >;
};

export type TmdbPersonDetails = {
    birthday?: string;
    known_for_department: string;
    deathday?: string;
    id: number;
    name: string;
    also_known_as: ReadonlyArray<string>;
    gender: number;
    biography: string;
    popularity: number;
    place_of_birth?: string;
    profile_path?: string;
    adult: boolean;
    imdb_id: string;
    homepage?: string;
    combined_credits: TmdbPersonCredits;
};

export type PersonCredits = ReadonlyArray<
    (Movie | (TvShow & { episodeCount: number })) & {
        creditId: string;
    } & (
            | { creditType: "crew"; job: string }
            | { creditType: "cast"; character: string }
        )
>;

export type PersonDetails = {
    mediaType: "person";
    birthday?: string;
    knownForDepartment: string;
    deathday?: string;
    id: number;
    name: string;
    alsoKnownAs: ReadonlyArray<string>;
    gender: number;
    biography: string;
    popularity: number;
    placeOfBirth?: string;
    profilePath?: string;
    adult: boolean;
    imdbId: string;
    homepage?: string;
    credits: PersonCredits;
};

export type ImageType = "backdrop" | "logo" | "poster" | "profile" | "still";
export type ImageSize = "small" | "medium" | "large" | "original";

export type TmdbListResult<T> = {
    page: number;
    total_results: number;
    total_pages: number;
    results: ReadonlyArray<T>;
};

export type ListResult<T> = {
    page: number;
    totalResults: number;
    totalPages: number;
    results: ReadonlyArray<T>;
};

export type TmdbSearchResult = TmdbListResult<
    | (TmdbMovie & { media_type: "movie" })
    | (TmdbTvShow & { media_type: "tv" })
    | (TmdbPerson & { media_type: "person" })
>;

export type SearchResult = ListResult<Movie | TvShow | Person>;

export type TmdbAccount = {
    avatar: {
        gravatar: {
            hash: string;
        };
    };
    id: number;
    iso_639_1: string;
    iso_3166_1: string;
    include_adult: boolean;
    username: string;
};

export type Account = {
    avatar: {
        gravatar: {
            hash: string;
        };
    };
    id: number;
    languageCode: string;
    countryCode: string;
    includeAdult: boolean;
    username: string;
};

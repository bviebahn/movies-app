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
    release_date: string;
    title: string;
    video: false;
    vote_average: number;
    vote_count: number;
};

export type Movie = {
    id: number;
    adult: boolean;
    backdropPath?: string;
    genreIds: ReadonlyArray<number>;
    genres: ReadonlyArray<Genre>;
    originalLanguage: string;
    originalTitle: string;
    overview: string;
    popularity: number;
    posterPath?: string;
    releaseDate: string;
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
};

export type TmdbTvShow = {
    poster_path?: string;
    popularity: number;
    id: number;
    backdrop_path?: string;
    vote_average: number;
    overview: string;
    first_air_date: string;
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
    backdropPath?: string;
    voteAverage: number;
    overview: string;
    firstAirDate: string;
    originCountry: ReadonlyArray<string>;
    genreIds: ReadonlyArray<number>;
    genres: ReadonlyArray<Genre>;
    originalLanguage: string;
    voteCount: number;
    name: string;
    originalName: string;
};

export type MovieDetails = Movie & {
    budget: number;
    homepage?: string;
    imdbId?: string;
    runtime?: number;
    status: string;
    tagline?: string;
    credits: Credits;
    reviews: ReadonlyArray<Review>;
    recommendations: ReadonlyArray<Movie>;
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

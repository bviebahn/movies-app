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
    releaseDate: Date;
    title: string;
    video: false;
    voteAverage: number;
    voteCount: number;
};

export type Genre = {
    id: number;
    name: string;
};

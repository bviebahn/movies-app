import { TmdbMovie, Movie, TmdbTvShow, TvShow, Genre } from "./types";

export function getPosterUrl(path: string) {
    return `https://image.tmdb.org/t/p/w342${path}`;
}

export function getBackdropUrl(path: string) {
    return `https://image.tmdb.org/t/p/w780${path}`;
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
        genres: [],
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
        genres: [],
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

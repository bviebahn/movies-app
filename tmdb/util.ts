import { TmdbMovie, Movie } from "./types";

export function getPosterUrl(path: string) {
    return `https://image.tmdb.org/t/p/w342${path}`;
}

export function getBackdropUrl(path: string) {
    return `https://image.tmdb.org/t/p/w780${path}`;
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

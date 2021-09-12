import { useQuery } from "react-query";
import QueryKeys from "../util/queryKeys";
import { MovieDetails, TmdbMovieDetails } from "./types";
import useUser from "./useUser";
import { convertCredits, convertMovie, fetchTmdb } from "./util";

function convertMovieDetails(details: TmdbMovieDetails): MovieDetails {
    return {
        mediaType: "movie",
        id: details.id,
        adult: details.adult,
        overview: details.overview,
        popularity: details.popularity,
        video: details.video,
        title: details.title,
        backdropPath: details.backdrop_path,
        genreIds: details.genre_ids,
        genres: details.genres,
        originalLanguage: details.original_language,
        originalTitle: details.original_title,
        posterPath: details.poster_path,
        releaseDate: details.release_date,
        voteAverage: details.vote_average,
        voteCount: details.vote_count,
        status: details.status,
        budget: details.budget,
        homepage: details.homepage,
        imdbId: details.imdb_id,
        runtime: details.runtime,
        tagline: details.tagline,
        credits: convertCredits(details.credits),
        reviews: details.reviews.results,
        recommendations: details.recommendations.results.map(convertMovie),
        accountStates: {
            favorite: !!details.account_states?.favorite,
            rated: details.account_states?.rated
                ? details.account_states.rated.value
                : 0,
            watchlist: !!details.account_states?.watchlist,
        },
    };
}

async function fetchMovieDetails(id: number, sessionId?: string) {
    // TODO: test sessionId = undefined?
    const response = await fetchTmdb(
        `/movie/${id}?append_to_response=credits,reviews,recommendations${
            sessionId ? `,account_states&session_id=${sessionId}` : ""
        }`
    );

    if (response.ok) {
        const result = await response.json();
        return convertMovieDetails(result);
    }

    throw new Error("Error fetching MovieDetails");
}

function useMovieDetails(id: number) {
    const { sessionId } = useUser();
    return useQuery(QueryKeys.MovieDetails(id, sessionId), () =>
        fetchMovieDetails(id, sessionId)
    );
}

export default useMovieDetails;

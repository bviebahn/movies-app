import { useQuery } from "react-query";

import { TmdbTvShowDetails, TvShowDetails } from "./types";
import useUser from "./useUser";
import { convertCredits, convertTvShow, fetchTmdb } from "./util";

function convertTvShowDetails(details: TmdbTvShowDetails): TvShowDetails {
    return {
        mediaType: "tv",
        id: details.id,
        overview: details.overview,
        popularity: details.popularity,
        name: details.name,
        backdropPath: details.backdrop_path,
        genreIds: details.genre_ids,
        genres: details.genres,
        originalLanguage: details.original_language,
        originalName: details.original_name,
        posterPath: details.poster_path,
        firstAirDate: details.first_air_date,
        voteAverage: details.vote_average,
        voteCount: details.vote_count,
        status: details.status,
        homepage: details.homepage,
        episodeRunTime: details.episode_run_time[0],
        createdBy: details.created_by.map(c => ({
            creditId: c.credit_id,
            gender: c.gender,
            id: c.id,
            name: c.name,
            profilePath: c.profile_path,
        })),
        inProduction: details.in_production,
        languages: details.languages,
        numberOfEpisodes: details.number_of_episodes,
        numberOfSeasons: details.number_of_seasons,
        originCountry: details.origin_country,
        seasons: details.seasons.map(s => ({
            airDate: s.air_date,
            episodeCount: s.episode_count,
            id: s.id,
            name: s.name,
            overview: s.overview,
            posterPath: s.poster_path,
            seasonNumber: s.season_number,
        })),
        type: details.type,
        credits: convertCredits(details.credits),
        reviews: details.reviews.results,
        recommendations: details.recommendations.results.map(convertTvShow),
        accountStates: {
            favorite: !!details.account_states?.favorite,
            rated: details.account_states?.rated
                ? details.account_states.rated.value
                : 0,
            watchlist: !!details.account_states?.watchlist,
        },
    };
}

async function fetchTvShowDetails(
    _key: string,
    id: number,
    sessionId?: string
) {
    const response = await fetchTmdb(
        `/tv/${id}?append_to_response=credits,reviews,recommendations${
            sessionId ? `,account_states&session_id=${sessionId}` : ""
        }`
    );

    if (response.ok) {
        const result = await response.json();
        return convertTvShowDetails(result);
    }

    throw new Error("Error fetching TvShowDetails");
}

function useTvShowDetails(id: number) {
    const { sessionId } = useUser();
    return useQuery(["tv-details", id, sessionId], fetchTvShowDetails);
}

export default useTvShowDetails;

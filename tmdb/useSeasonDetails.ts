import { useQuery } from "react-query";

import { SeasonDetails, TmdbSeasonDetails } from "./types";
import { fetchTmdb } from "./util";

function convertSeasonDetails(details: TmdbSeasonDetails): SeasonDetails {
    return {
        id: details.id,
        overview: details.overview,
        name: details.name,
        posterPath: details.poster_path,
        airDate: details.air_date,
        seasonNumber: details.season_number,
        episodes: details.episodes.map((e) => ({
            airDate: e.air_date,
            guestStars: e.guest_stars,
            id: e.id,
            name: e.name,
            overview: e.overview,
            seasonNumber: e.season_number,
            voteAverage: e.vote_average,
            voteCount: e.vote_count,
            productionCode: e.production_code,
            episodeNumber: e.episode_number,
            stillPath: e.still_path,
        })),
    };
}

async function fetchSeasonDetails(
    _key: "season-details",
    id: number,
    seasonNumber: number,
) {
    const response = await fetchTmdb(`/tv/${id}/season/${seasonNumber}`);
    if (response.ok) {
        const result = await response.json();
        return convertSeasonDetails(result);
    }

    throw new Error("Error fetching SeasonDetails");
}

function useSeasonDetails(id: number, seasonNumber: number) {
    return useQuery(["season-details", id, seasonNumber], fetchSeasonDetails);
}

export default useSeasonDetails;

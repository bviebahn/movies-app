import { PersonCredits } from "../../tmdb/types";

type Media =
    | { mediaType: "movie"; releaseDate?: string }
    | { mediaType: "tv"; firstAirDate?: string };

export function getDate(m: Media) {
    return m.mediaType === "movie" ? m.releaseDate : m.firstAirDate;
}

function sortFn(a: Media, b: Media) {
    const aDate = getDate(a);
    const bDate = getDate(b);

    if (!aDate) {
        return !bDate ? 0 : 1;
    }

    if (!bDate) {
        return -1;
    }

    if (aDate > bDate) {
        return -1;
    } else if (aDate < bDate) {
        return 1;
    }

    return 0;
}

export function sortCredits(credits: PersonCredits) {
    return credits.slice().sort(sortFn);
}

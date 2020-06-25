import { PersonCredits } from "../../tmdb/types";

function sortFn(
    a:
        | { mediaType: "movie"; releaseDate?: string }
        | { mediaType: "tv"; firstAirDate?: string },
    b:
        | { mediaType: "movie"; releaseDate?: string }
        | { mediaType: "tv"; firstAirDate?: string },
) {
    const aDate = a.mediaType === "movie" ? a.releaseDate : a.firstAirDate;
    const bDate = b.mediaType === "movie" ? b.releaseDate : b.firstAirDate;

    if (!aDate) {
        return !bDate ? 0 : -1;
    }

    if (!bDate) {
        return 1;
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

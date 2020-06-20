import { Translations } from "./types";

const translations: Translations = {
    REVIEWS: "Rezensionen",
    CAST: "Besetzung",
    POPULAR_MOVIES: "Beliebte Filme",
    POPULAR_TV_SHOWS: "Beliebte Serien",
    BY: ({ name }) => `von ${name}`,
    READ_MORE: "Weiterlesen",
    RECOMMENDATIONS: "Empfehlungen",
    SEARCH: "Suche",
    ORIGINAL_LANGUAGE: "Originalsprache",
    GENRES: "Genres",
    SEASONS: "Staffeln",
    EPISODES: "Folgen",
    CREATOR: ({ n }) => (n > 1 ? "Creators" : "Creator"),
    MOVIE_GENRES: "Film Genres",
    TV_GENRES: "TV Genres",
    SIGNIN_TEXT:
        "Melde dich mit deinem TMDb-Account an für mehr Funktionen. Du hast keinen? Es ist kostenlos!",
    SUBMITTED: "Gesendet",
    LOGIN: "Anmelden",
    LOGOUT: "Abmelden",
    FAVORITES: "Favoriten",
    WATCHLIST: "Watchlist", // TODO: ?
    RATED: "Bewertet",
    MOVIES: "Filme",
    TV_SHOWS: "Serien",
    ACCOUNT_LIST_TITLE: ({ type, mediaType }) => {
        return (() => {
            switch (type) {
                case "favorites":
                    return `${
                        mediaType === "movie" ? "Film" : "Serien"
                    } Favoriten`;
                case "rated":
                    return `Bewertete ${
                        mediaType === "movie" ? "Filme" : "Serien"
                    }`;
                case "watchlist":
                    return `${
                        mediaType === "movie" ? "Film" : "Serien"
                    } Watchlist`;
                case "recommendations":
                    return `${
                        mediaType === "movie" ? "Film" : "Serien"
                    } Empfehlungen`;
            }
        })();
    },
};

export default translations;

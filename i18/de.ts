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
    BIRTHDAY: "Geburtstag",
    PLACE_OF_BIRTH: "Geburtsort",
    DEATHDAY: "Todestag",
    BIOGRAPHY: "Biografie",
    CREDITS: "Credits",
    AS_CHARACTER: ({ character }) => `als ${character}`,
};

export default translations;

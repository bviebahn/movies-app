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
};

export default translations;

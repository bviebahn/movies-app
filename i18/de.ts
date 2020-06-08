import { Translations } from "./types";

const translations: Translations = {
    REVIEWS: "Rezensionen",
    CAST: "Besetzung",
    POPULAR: "Beliebt",
    BY: ({ name }) => `von ${name}`,
    READ_MORE: "Weiterlesen",
    RECOMMENDATIONS: "Empfehlungen",
    SEARCH: "Suche",
};

export default translations;

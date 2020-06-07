import { Translations } from "./types";

const translations: Translations = {
    REVIEWS: "Reviews",
    CAST: "Cast",
    POPULAR: "Popular",
    BY: ({ name }) => `by ${name}`,
    READ_MORE: "Read more",
    RECOMMENDATIONS: "Recommendations",
};

export default translations;

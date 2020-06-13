import { Translations } from "./types";

const translations: Translations = {
    REVIEWS: "Reviews",
    CAST: "Cast",
    POPULAR_MOVIES: "Popular Movies",
    POPULAR_TV_SHOWS: "Popular TV Shows",
    BY: ({ name }) => `by ${name}`,
    READ_MORE: "Read more",
    RECOMMENDATIONS: "Recommendations",
    SEARCH: "Search",
    ORIGINAL_LANGUAGE: "Original Language",
    GENRES: "Genres",
    SEASONS: "Seasons",
    EPISODES: "Episodes",
    CREATOR: ({ n }) => (n > 1 ? "Creators" : "Creator"),
    MOVIE_GENRES: "Movie Genres",
    TV_GENRES: "TV Genres",
};

export default translations;

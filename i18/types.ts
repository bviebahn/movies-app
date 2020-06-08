export type SubstituteTranslation<Data> = (data: Data) => string;

export type Translations = {
    REVIEWS: string;
    CAST: string;
    POPULAR_MOVIES: string;
    POPULAR_TV_SHOWS: string;
    BY: SubstituteTranslation<{ name: string }>;
    READ_MORE: string;
    RECOMMENDATIONS: string;
    SEARCH: string;
};

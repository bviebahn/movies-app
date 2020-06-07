export type SubstituteTranslation<Data> = (data: Data) => string;

export type Translations = {
    REVIEWS: string;
    CAST: string;
    POPULAR: string;
    BY: SubstituteTranslation<{ name: string }>;
    READ_MORE: string;
    RECOMMENDATIONS: string;
};

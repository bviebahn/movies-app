import { findBestAvailableLanguage } from "react-native-localize";
import { SubstituteTranslation, Translations } from "./types";

let translations: Translations;

function translate<Key extends keyof Translations>(
    key: Key,
    ...data: Translations[Key] extends SubstituteTranslation<infer P> ? [P] : []
): string {
    const translation = translations[key];

    if (!translation) {
        return key;
    }

    if ((translation as any).apply) {
        return (translation as any)(data[0] as any);
    }

    return translation as string;
}

type LanguageTag = "en" | "de";

const availableTranslations: Array<LanguageTag> = ["en", "de"];

(async () => {
    const locale = findBestAvailableLanguage(availableTranslations);
    switch (locale?.languageTag || "en") {
        case "en":
            translations = (await import("./en")).default;
            break;
        case "de":
            translations = (await import("./de")).default;
            break;
    }
})();

export default translate;

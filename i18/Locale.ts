import { Translations, SubstituteTranslation } from "./types";
import { findBestAvailableLanguage } from "react-native-localize";

let translations: Translations;

function translate<Key extends keyof Translations>(
    key: Key,
    ...data: Translations[Key] extends SubstituteTranslation<infer P> ? [P] : []
) {
    const translation = translations[key];

    if (!translation) {
        return key;
    }

    if ((translation as any).apply) {
        return (translation as any)(data[0] as any);
    }

    return translation;
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

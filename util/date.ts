import { getLocales } from "react-native-localize";

const deviceLocale = getLocales()[0].languageTag;

export function formatDate(date: Date, locale = deviceLocale) {
    return date.toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "2-digit",
    });
}

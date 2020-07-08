import { formatDate } from "../date";

jest.mock("react-native-localize", () => ({
    getLocales: jest.fn().mockReturnValue([{ languageTag: "ar-EG" }]),
}));

describe("utils - date", () => {
    it("formatDate", () => {
        expect(formatDate(new Date(0))).toEqual("Jan 01, 1970");
    });
});

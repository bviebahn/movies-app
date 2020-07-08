import { convertMinutesToTimeString } from "../time";

describe("utils - time", () => {
    it("convertMinutesToTimeString", () => {
        expect(convertMinutesToTimeString(0)).toEqual("");
        expect(convertMinutesToTimeString(20)).toEqual("20m");
        expect(convertMinutesToTimeString(60)).toEqual("1h");
        expect(convertMinutesToTimeString(85)).toEqual("1h 25m");
        expect(convertMinutesToTimeString(240)).toEqual("4h");
        expect(convertMinutesToTimeString(187)).toEqual("3h 7m");
    });
});

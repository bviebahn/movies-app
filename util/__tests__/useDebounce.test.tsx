import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { fireEvent, render } from "react-native-testing-library";
import { act } from "react-test-renderer";
import useDebounce, { useDebouncedValue } from "../useDebounce";

describe("utils - useDebounce", () => {
    it("useDebouncedValue", () => {
        function Component() {
            const [value, setValue] = useState(0);
            const debounced = useDebouncedValue(value, 1000);
            return (
                <View>
                    <TouchableOpacity
                        testID="button"
                        onPress={() => setValue(v => v + 1)}
                    />
                    <Text>{`value: ${value}`}</Text>
                    <Text>{`debouncedValue: ${debounced}`}</Text>
                </View>
            );
        }

        const { getByText, getByTestId } = render(<Component />);
        const valueText = getByText("value: 0");
        const debouncedText = getByText("debouncedValue: 0");
        const button = getByTestId("button");

        fireEvent.press(button);

        expect(valueText.props.children).toEqual("value: 1");
        expect(debouncedText.props.children).toEqual("debouncedValue: 0");

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(valueText.props.children).toEqual("value: 1");
        expect(debouncedText.props.children).toEqual("debouncedValue: 1");

        fireEvent.press(button);

        act(() => {
            jest.advanceTimersByTime(500);
        });

        fireEvent.press(button);

        expect(valueText.props.children).toEqual("value: 3");
        expect(debouncedText.props.children).toEqual("debouncedValue: 1");

        act(() => {
            jest.advanceTimersByTime(600);
        });

        expect(valueText.props.children).toEqual("value: 3");
        expect(debouncedText.props.children).toEqual("debouncedValue: 1");

        act(() => {
            jest.advanceTimersByTime(400);
        });

        expect(valueText.props.children).toEqual("value: 3");
        expect(debouncedText.props.children).toEqual("debouncedValue: 3");
    });

    it("useDebounce", () => {
        const fn = jest.fn();

        function Component() {
            const debouncedFn = useDebounce(fn, 1000);
            return (
                <TouchableOpacity
                    onPress={() => debouncedFn("arg1", 2)}
                    testID="button"
                />
            );
        }

        const { getByTestId } = render(<Component />);
        const button = getByTestId("button");

        fireEvent.press(button);
        expect(fn).not.toHaveBeenCalled();

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith("arg1", 2);

        fireEvent.press(button);

        expect(fn).toHaveBeenCalledTimes(1);

        act(() => {
            jest.advanceTimersByTime(500);
        });

        fireEvent.press(button);

        expect(fn).toHaveBeenCalledTimes(1);

        act(() => {
            jest.advanceTimersByTime(500);
        });

        expect(fn).toHaveBeenCalledTimes(1);

        act(() => {
            jest.advanceTimersByTime(500);
        });

        expect(fn).toHaveBeenCalledTimes(2);
    });
});

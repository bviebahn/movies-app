import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delay: number) {
    const [state, setState] = useState(value);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setState(value);
        }, delay);

        return () => clearTimeout(timeout);
    }, [value, delay]);

    return state;
}

function useDebounce<T extends any[]>(fn: (...args: T) => void, delay: number) {
    const [timeoutId, setTimeoutId] = useState<number>();

    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    return (...args: T) => {
        setTimeoutId(setTimeout(() => fn(...args), delay));
    };
}

export default useDebounce;

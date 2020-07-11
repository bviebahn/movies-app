import {
    Animated,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from "react-native";
import { useRef } from "react";

function useParallax(
    amount: number
): {
    scrollHandler: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    style: {
        transform: {
            translateY: Animated.AnimatedInterpolation;
        }[];
    };
} {
    const anim = useRef(new Animated.Value(0));

    return {
        scrollHandler: Animated.event(
            [
                {
                    nativeEvent: {
                        contentOffset: {
                            y: anim.current,
                        },
                    },
                },
            ],
            { useNativeDriver: false }
        ),
        style: {
            transform: [
                {
                    translateY: anim.current.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, amount],
                    }),
                },
            ],
        },
    };
}

export default useParallax;

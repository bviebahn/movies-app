import React, { useState, useEffect, useRef } from "react";
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Animated,
    Easing,
} from "react-native";
import SearchBar from "react-native-search-bar";
import { textColorSecondary } from "../constants/colors";
import translate from "../i18/Locale";

const Search: React.FC = () => {
    const [focused, setFocused] = useState(false);
    const anim = useRef(new Animated.Value(1));

    useEffect(() => {
        if (focused) {
            Animated.timing(anim.current, {
                toValue: 0,
                duration: 300,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(anim.current, {
                toValue: 1,
                duration: 300,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
        }
    }, [focused]);

    return (
        <SafeAreaView>
            <ScrollView style={styles.search}>
                <Animated.View
                    style={{
                        transform: [
                            {
                                translateY: anim.current.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-50, 0],
                                }),
                            },
                        ],
                    }}>
                    <Animated.Text
                        style={[
                            styles.screenTitle,
                            {
                                opacity: anim.current,
                            },
                        ]}>
                        {translate("SEARCH")}
                    </Animated.Text>
                    <SearchBar
                        barStyle="black"
                        hideBackground
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                    />
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    search: {
        padding: 20,
    },
    screenTitle: {
        color: textColorSecondary,
        fontSize: 32,
        fontWeight: "bold",
    },
});

export default Search;

import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useSafeArea } from "react-native-safe-area-context";

import ListTile from "../components/ListTile";
import {
    favoriteRed,
    favoriteRedDark,
    lightRed,
    ratedYellow,
    ratedYellowDark,
    textColorSecondary,
    tmdbPrimaryColor,
    tmdbSecondaryColor,
    watchlistGreen,
    watchlistGreenDark,
} from "../constants/colors";
import translate from "../i18/Locale";
import { ProfileStackNavigationProp } from "../navigators/ProfileStackNavigator";
import LogoFull from "../tmdb/LogoFull";
import useUser from "../tmdb/useUser";
import { getGravatarImageUrl } from "../tmdb/util";

const Profile: React.FC = () => {
    const navigation = useNavigation<ProfileStackNavigationProp<"Profile">>();
    const {
        user,
        loading,
        createRequestToken,
        createSessionId,
        logout,
    } = useUser();
    const [requestToken, setRequestToken] = useState<string>();
    const { top } = useSafeArea();

    useEffect(() => {
        if (requestToken) {
            const unsubscribe = navigation.addListener("focus", async () => {
                if (requestToken) {
                    await createSessionId(requestToken);
                    setRequestToken(undefined);
                }
            });

            return unsubscribe;
        }
    }, [navigation, requestToken, createSessionId]);

    const handleLogin = async () => {
        const newRequestToken = await createRequestToken();
        if (newRequestToken) {
            setRequestToken(newRequestToken);
            navigation.navigate("Authenticate", {
                requestToken: newRequestToken,
            });
        }
    };

    return (
        <View>
            <View style={[styles.userRow, { paddingTop: top + 20 }]}>
                {user ? (
                    <>
                        <Image
                            source={{
                                uri: getGravatarImageUrl(
                                    user.avatar.gravatar.hash,
                                ),
                            }}
                            style={styles.avatar}
                        />
                        <Text style={styles.username}>{user.username}</Text>
                    </>
                ) : (
                    <LogoFull size={48} />
                )}
                <RectButton
                    onPress={user ? logout : handleLogin}
                    enabled={!loading}
                    rippleColor={tmdbPrimaryColor}
                    style={[
                        styles.singinButton,
                        ...(user ? [{ backgroundColor: lightRed }] : []),
                    ]}>
                    {loading ? (
                        <ActivityIndicator color={tmdbPrimaryColor} />
                    ) : (
                        <Text style={styles.signinButtonText}>
                            {user ? translate("LOGOUT") : translate("LOGIN")}
                        </Text>
                    )}
                </RectButton>
            </View>
            {!user ? (
                <Text style={styles.signinText}>
                    {translate("SIGNIN_TEXT")}
                </Text>
            ) : undefined}
            <ListTile
                iconName="heart"
                iconColor={favoriteRed}
                title={translate("FAVORITES")}
                backgroundColor={favoriteRedDark}
                onPress={() => undefined}
            />
            <ListTile
                iconName="bookmark"
                iconColor={watchlistGreen}
                title={translate("WATCHLIST")}
                backgroundColor={watchlistGreenDark}
                onPress={() => undefined}
            />
            <ListTile
                iconName="star"
                iconColor={ratedYellow}
                title={translate("RATED")}
                backgroundColor={ratedYellowDark}
                onPress={() => undefined}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    userRow: {
        flexDirection: "row",
        padding: 20,
        backgroundColor: tmdbPrimaryColor,
        alignItems: "center",
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    username: {
        marginHorizontal: 10,
        fontSize: 24,
        fontWeight: "bold",
        color: textColorSecondary,
        flexShrink: 1,
    },
    signinText: {
        color: tmdbSecondaryColor,
        fontSize: 14,
        padding: 20,
        paddingTop: 0,
        flexShrink: 1,
        fontWeight: "bold",
        backgroundColor: tmdbPrimaryColor,
    },
    singinButton: {
        backgroundColor: tmdbSecondaryColor,
        borderRadius: 16,
        justifyContent: "center",
        marginLeft: "auto",
        paddingHorizontal: 40,
        height: 32,
    },
    signinButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: tmdbPrimaryColor,
    },
});

export default Profile;

import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useSafeArea } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";

import AccountLists from "../components/AccountLists";
import ListTile from "../components/ListTile";
import {
    favoriteRed,
    favoriteRedDark,
    lightRed,
    ratedYellow,
    ratedYellowDark,
    recommendationsColor,
    recommendationsColorDark,
    textColorSecondary,
    tmdbPrimaryColor,
    tmdbPrimaryColorDark,
    tmdbSecondaryColor,
    watchlistGreen,
    watchlistGreenDark,
} from "../constants/colors";
import translate from "../i18/Locale";
import { ProfileStackNavigationProp } from "../navigators/ProfileStackNavigator";
import LogoFull from "../tmdb/LogoFull";
import useUser, { createRequestToken } from "../tmdb/useUser";
import { getGravatarImageUrl } from "../tmdb/util";

const LoginLogoutButton: React.FC<{
    isLoggedIn: boolean;
    onLogin: () => void;
    onLogout: () => void;
    loading: boolean;
}> = ({ isLoggedIn, onLogin, onLogout, loading }) => {
    const buttonContent = (() => {
        if (loading) {
            return <ActivityIndicator color={tmdbPrimaryColor} />;
        }

        return isLoggedIn ? (
            <Icon name="sign-out" color={tmdbPrimaryColor} size={24} />
        ) : (
            <Text style={styles.signinButtonText}>{translate("LOGIN")}</Text>
        );
    })();
    return (
        <RectButton
            onPress={isLoggedIn ? onLogout : onLogin}
            enabled={!loading}
            rippleColor={tmdbPrimaryColor}
            style={[
                styles.singinButton,
                ...(isLoggedIn
                    ? [{ backgroundColor: lightRed, paddingHorizontal: 20 }]
                    : []),
            ]}>
            {buttonContent}
        </RectButton>
    );
};

const Profile: React.FC = () => {
    const navigation = useNavigation<ProfileStackNavigationProp<"Profile">>();
    const { user, loading, auth, logout } = useUser();
    const [requestToken, setRequestToken] = useState<string>();
    const { top } = useSafeArea();

    useEffect(() => {
        if (requestToken) {
            const unsubscribe = navigation.addListener("focus", async () => {
                if (requestToken) {
                    await auth(requestToken);
                    setRequestToken(undefined);
                }
            });

            return unsubscribe;
        }
    }, [navigation, requestToken, auth]);

    const handleLogin = async () => {
        try {
            const newRequestToken = await createRequestToken();
            setRequestToken(newRequestToken);
            navigation.navigate("Authenticate", {
                requestToken: newRequestToken,
            });
        } catch {
            // TODO: show error
        }
    };

    const topContent = (
        <>
            {!user ? (
                <Text style={styles.signinText}>
                    {translate("SIGNIN_TEXT")}
                </Text>
            ) : (
                <>
                    <ListTile
                        iconName="heart"
                        iconColor={favoriteRed}
                        title={translate("FAVORITES")}
                        backgroundColor={favoriteRedDark}
                        onPress={() =>
                            navigation.navigate("AccountList", {
                                type: "favorites",
                            })
                        }
                    />
                    <ListTile
                        iconName="bookmark"
                        iconColor={watchlistGreen}
                        title={translate("WATCHLIST")}
                        backgroundColor={watchlistGreenDark}
                        onPress={() =>
                            navigation.navigate("AccountList", {
                                type: "watchlist",
                            })
                        }
                    />
                    <ListTile
                        iconName="star"
                        iconColor={ratedYellow}
                        title={translate("RATED")}
                        backgroundColor={ratedYellowDark}
                        onPress={() =>
                            navigation.navigate("AccountList", {
                                type: "rated",
                            })
                        }
                    />
                    <ListTile
                        iconName="thumbs-up"
                        iconColor={recommendationsColor}
                        title={translate("RECOMMENDATIONS")}
                        backgroundColor={recommendationsColorDark}
                        onPress={() =>
                            navigation.navigate("AccountList", {
                                type: "recommendations",
                            })
                        }
                    />
                </>
            )}
        </>
    );

    return (
        <View style={styles.profile}>
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
                <LoginLogoutButton
                    isLoggedIn={!!user}
                    loading={loading}
                    onLogin={handleLogin}
                    onLogout={logout}
                />
            </View>
            <AccountLists
                style={styles.accountLists}
                ListHeaderComponent={topContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    profile: { flex: 1 },
    userRow: {
        flexDirection: "row",
        padding: 20,
        backgroundColor: tmdbPrimaryColor,
        alignItems: "center",
        borderBottomColor: tmdbPrimaryColorDark,
        borderBottomWidth: 1,
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
        height: 32,
    },
    signinButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: tmdbPrimaryColor,
    },
    accountLists: {
        flex: 1,
    },
});

export default Profile;

import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from "react-native";
import { useSafeArea } from "react-native-safe-area-context";

import {
    textColorSecondary,
    tmdbPrimaryColor,
    tmdbSecondaryColor,
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
                <TouchableOpacity
                    onPress={user ? logout : handleLogin}
                    disabled={loading}
                    style={styles.singinButton}>
                    {loading ? (
                        <ActivityIndicator color={tmdbPrimaryColor} />
                    ) : (
                        <Text style={styles.signinButtonText}>
                            {user ? translate("LOGOUT") : translate("LOGIN")}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
            {!user ? (
                <Text style={styles.signinText}>
                    {translate("SIGNIN_TEXT")}
                </Text>
            ) : undefined}
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
        marginLeft: 10,
        fontSize: 24,
        fontWeight: "bold",
        color: textColorSecondary,
    },
    signinText: {
        color: textColorSecondary,
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

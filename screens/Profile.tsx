import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeArea } from "react-native-safe-area-context";

import { textColorSecondary } from "../constants/colors";
import translate from "../i18/Locale";
import { ProfileStackNavigationProp } from "../navigators/ProfileStackNavigator";
import LogoFull from "../tmdb/LogoFull";
import useUser from "../tmdb/useUser";
import { getGravatarImageUrl } from "../tmdb/util";

const Profile: React.FC = () => {
    const navigation = useNavigation<ProfileStackNavigationProp<"Profile">>();
    const { user, createRequestToken, createSessionId } = useUser();
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
    console.log(user);

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
                    <>
                        <LogoFull size={48} />
                        <TouchableOpacity
                            onPress={handleLogin}
                            style={styles.singinButton}>
                            <Text style={styles.signinButtonText}>Sign in</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
            <Text style={styles.signinText}>{translate("SIGNIN_TEXT")}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    userRow: {
        flexDirection: "row",
        padding: 20,
        backgroundColor: "#0d253f",
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
        backgroundColor: "#0d253f",
    },
    singinButton: {
        backgroundColor: "#01b4e4",
        borderRadius: 16,
        justifyContent: "center",
        marginLeft: "auto",
        paddingHorizontal: 40,
        height: 32,
    },
    signinButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#0d253f",
    },
});

export default Profile;

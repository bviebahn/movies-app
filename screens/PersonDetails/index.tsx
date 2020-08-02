import { useRoute } from "@react-navigation/native";
import React, { useMemo } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DynamicSizedTitle from "../../components/DynamicSizedTitle";
import InfoBox from "../../components/InfoBox";
import { textColorSecondary } from "../../constants/colors";
import { shadowStyle } from "../../constants/styles";
import translate from "../../i18/Locale";
import useImageUrl from "../../tmdb/useImageUrl";
import usePersonDetails from "../../tmdb/usePerson";
import { formatDate } from "../../util/date";
import CreditsList from "./CreditsList";
import { sortCredits } from "./util";

const PersonDetails: React.FC = () => {
    const route = useRoute();
    const id = (route.params! as any).id;

    const getImageUrl = useImageUrl();

    const { data } = usePersonDetails(id);
    const {
        biography,
        credits,
        name,
        birthday,
        deathday,
        placeOfBirth,
        profilePath,
    } = data || {};
    console.log(data);

    const infos = [
        ...(birthday
            ? [
                  {
                      key: translate("BIRTHDAY"),
                      value: formatDate(new Date(birthday)),
                  },
              ]
            : []),
        ...(placeOfBirth
            ? [
                  {
                      key: translate("PLACE_OF_BIRTH"),
                      value: placeOfBirth,
                  },
              ]
            : []),
        ...(deathday
            ? [
                  {
                      key: translate("DEATHDAY"),
                      value: formatDate(new Date(deathday)),
                  },
              ]
            : []),
    ];

    const creditsSorted = useMemo(() => (credits ? sortCredits(credits) : []), [
        credits,
    ]);

    const topContent = data ? (
        <>
            <View style={styles.topContent}>
                {profilePath ? (
                    <View style={[styles.posterWrapper, shadowStyle]}>
                        <Image
                            source={{
                                uri: getImageUrl(
                                    profilePath,
                                    "profile",
                                    "large"
                                ),
                            }}
                            style={styles.poster}
                        />
                    </View>
                ) : undefined}
                <View style={styles.infoWrapper}>
                    <DynamicSizedTitle title={name || ""} />
                    <InfoBox data={infos} />
                </View>
            </View>

            {biography ? (
                <>
                    <Text style={styles.title}>{translate("BIOGRAPHY")}</Text>
                    <Text style={styles.biography}>{biography}</Text>
                </>
            ) : undefined}
            <Text style={styles.title}>{translate("CREDITS")}</Text>
        </>
    ) : (
        <ActivityIndicator />
    );

    return (
        <SafeAreaView>
            <CreditsList
                credits={creditsSorted}
                ListHeaderComponent={topContent}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    topContent: {
        flexDirection: "row",
        margin: 20,
        marginTop: 40,
    },
    infoWrapper: { flexShrink: 1 },
    posterWrapper: {
        marginBottom: 8,
        marginRight: 20,
    },
    poster: {
        width: 160,
        height: 240,
        borderRadius: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: "200",
        marginLeft: 20,
        color: textColorSecondary,
    },
    biography: {
        color: textColorSecondary,
        marginTop: 10,
        margin: 20,
    },
});

export default PersonDetails;

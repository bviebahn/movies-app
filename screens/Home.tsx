import React from "react";
import useMovies from "../tmdb/useMovies";
import MovieWidget from "../components/MovieWidget";
import { SafeAreaView } from "react-native";
import translate from "../i18/Locale";

const Home: React.FC = () => {
    const { data } = useMovies("popular");

    if (!data) {
        return null;
    }

    return (
        <SafeAreaView>
            <MovieWidget title={translate("POPULAR")} movies={data} />
        </SafeAreaView>
    );
};

export default Home;

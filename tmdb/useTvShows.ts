import { useEffect, useState } from "react";

import { TvShow } from "./types";
import { convertTvShow, fetchTmdb } from "./util";

const useTvShows = (
    type: "popular" | "latest" | "airing_today" | "top_rated" | "on_the_air"
) => {
    const [data, setData] = useState<ReadonlyArray<TvShow>>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchTvShows = async () => {
            const response = await fetchTmdb(`/tv/${type}`);

            setLoading(false);
            if (response.ok) {
                const tvShows = await response.json();
                setData(tvShows.results.map(convertTvShow));
            } else {
                setError(true);
            }
        };
        fetchTvShows();
    }, [type]);

    return { data, loading, error };
};

export default useTvShows;

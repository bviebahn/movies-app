import { useQuery } from "react-query";
import {
    fetchTmdb,
    convertListResult,
    convertMovie,
    convertTvShow,
} from "./util";
import useUser from "./useUser";
import { ListResult, Movie, TvShow, TmdbListResult } from "./types";

type MediaType = {
    movie: Movie;
    tv: TvShow;
};

async function fetchList<T extends keyof MediaType>(
    _key: string,
    accountId: string,
    type: "favorites" | "watchlist" | "rated" | "recommendations",
    mediaType: T,
    accessToken: string,
): Promise<ListResult<MediaType[T]>> {
    const response = await fetchTmdb(
        `/account/${accountId}/${mediaType}/${type}`,
        {
            version: 4,
            accessToken,
        },
    );

    if (response.ok) {
        const result: TmdbListResult<MediaType[T]> = await response.json();
        return convertListResult(
            result,
            (mediaType === "movie" ? convertMovie : convertTvShow) as any,
        );
    }

    throw new Error("Error fetching account list");
}

function useAccountList<T extends keyof MediaType>(
    type: "favorites" | "watchlist" | "rated" | "recommendations",
    mediaType: T,
) {
    const { accountId, accessToken } = useUser();
    if (!accountId || !accessToken) {
        throw new Error("Missing accountId or access token");
    }

    return useQuery({
        queryKey: ["account-list", accountId, type, mediaType],
        variables: [accessToken],
        queryFn: fetchList,
    });
}

export default useAccountList;

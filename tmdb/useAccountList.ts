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

type Type<
    T extends "favorites" | "watchlist" | "rated" | "recommendations",
    M extends keyof MediaType
> = T extends "rated" ? MediaType[M] & { accountRating: number } : MediaType[M];

async function fetchList<
    T extends "favorites" | "watchlist" | "rated" | "recommendations",
    M extends keyof MediaType
>(
    _key: string,
    accountId: string,
    type: T,
    mediaType: M,
    accessToken: string,
): Promise<ListResult<Type<T, M>>> {
    const response = await fetchTmdb(
        `/account/${accountId}/${mediaType}/${type}`,
        {
            version: 4,
            accessToken,
        },
    );

    if (response.ok) {
        const result: TmdbListResult<MediaType[M]> = await response.json();
        const convertFnForMediaType =
            mediaType === "movie" ? convertMovie : convertTvShow;
        const convertFn: any =
            type === "rated"
                ? (m: any) => ({
                      ...convertFnForMediaType(m),
                      accountRating: m.account_rating.value,
                  })
                : convertFnForMediaType;
        return convertListResult(result, convertFn);
    }

    throw new Error("Error fetching account list");
}

function useAccountList<
    T extends "favorites" | "watchlist" | "rated" | "recommendations",
    M extends keyof MediaType
>(type: T, mediaType: M) {
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

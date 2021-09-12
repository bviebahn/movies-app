import { useInfiniteQuery } from "react-query";
import { ListResult, Movie, TmdbListResult, TvShow } from "./types";
import useUser from "./useUser";
import {
    convertListResult,
    convertMovie,
    convertTvShow,
    fetchTmdb,
} from "./util";

type MediaType = {
    movie: Movie;
    tv: TvShow;
};

export type AccountListType =
    | "favorites"
    | "watchlist"
    | "rated"
    | "recommendations";

type Type<
    T extends AccountListType,
    M extends keyof MediaType
> = T extends "rated" ? MediaType[M] & { accountRating: number } : MediaType[M];

async function fetchList<T extends AccountListType, M extends keyof MediaType>(
    accountId: string,
    type: T,
    mediaType: M,
    accessToken: string,
    page?: unknown
): Promise<ListResult<Type<T, M>>> {
    const response = await fetchTmdb(
        `/account/${accountId}/${mediaType}/${type}${
            page ? `?page=${page}` : ""
        }`,
        {
            version: 4,
            accessToken,
        }
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

function useAccountList<T extends AccountListType, M extends keyof MediaType>(
    type: T,
    mediaType: M
) {
    const { accountId, accessToken } = useUser();
    if (!accountId || !accessToken) {
        throw new Error("Missing accountId or access token");
    }

    return useInfiniteQuery(
        ["account-list", accountId, type, mediaType, accessToken],
        () => fetchList(accountId, type, mediaType, accessToken),
        {
            getNextPageParam: prevPage =>
                prevPage.page < prevPage.totalPages && prevPage.page + 1,
        }
    );
}

export default useAccountList;

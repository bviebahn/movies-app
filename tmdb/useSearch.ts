import { useInfiniteQuery } from "react-query";
import QueryKeys from "../util/queryKeys";
import { TmdbSearchResult } from "./types";
import { convertSearchResult, fetchTmdb } from "./util";

async function fetchSearch(query: string, page: unknown = 1) {
    const response = await fetchTmdb(
        `/search/multi?query=${query}&page=${page}`
    );

    if (response.ok) {
        const result: TmdbSearchResult = await response.json();
        console.log(page, convertSearchResult(result));
        return convertSearchResult(result);
    }

    throw new Error("Error fetching Search");
}

function useSearch(query: string) {
    return useInfiniteQuery(
        QueryKeys.Search(query),
        ({ pageParam }) => fetchSearch(query, pageParam),
        {
            getNextPageParam: prevPage =>
                prevPage.page < prevPage.totalPages && prevPage.page + 1,
        }
    );
}

export default useSearch;

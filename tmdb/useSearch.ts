import { useInfiniteQuery } from "react-query";
import { TmdbSearchResult } from "./types";
import { convertSearchResult, fetchTmdb } from "./util";

async function fetchSearch(query: string, page: unknown = 1) {
    const response = await fetchTmdb(
        `/search/multi?query=${query}&page=${page}`
    );

    if (response.ok) {
        const result: TmdbSearchResult = await response.json();
        return convertSearchResult(result);
    }

    throw new Error("Error fetching Search");
}

function useSearch(query: string) {
    return useInfiniteQuery(["search", query], () => fetchSearch(query), {
        getNextPageParam: prevPage =>
            prevPage.page < prevPage.totalPages && prevPage.page + 1,
    });
}

export default useSearch;

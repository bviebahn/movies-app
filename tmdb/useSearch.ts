import { TmdbSearchResult } from "./types";
import { convertSearchResult, fetchTmdb } from "./util";
import { useInfiniteQuery } from "react-query";

async function fetchSearch(_key: "search", query: string, page: number = 1) {
    const response = await fetchTmdb(
        `/search/multi?query=${query}&page=${page}`,
    );

    if (response.ok) {
        const result: TmdbSearchResult = await response.json();
        return convertSearchResult(result);
    }

    throw new Error("Error fetching Search");
}

function useSearch(query: string) {
    return useInfiniteQuery(
        ["search", query],
        async () => fetchSearch("search", query),
        {
            getFetchMore: (prevPage) =>
                prevPage.page < prevPage.totalPages && prevPage.page + 1,
        },
    );
}

export default useSearch;

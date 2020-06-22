import { TmdbSearchResult, ListResult, Movie, TvShow, Person } from "./types";
import { convertSearchResult, fetchTmdb } from "./util";
import { useInfiniteQuery } from "react-query";

async function fetchSearch(_key: string, query: string, page: number = 1) {
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
    return useInfiniteQuery<
        ListResult<Movie | TvShow | Person>,
        [string, string],
        number,
        [],
        Error
    >({
        queryKey: ["search", query],
        queryFn: fetchSearch,
        config: {
            getFetchMore: (prevPage) =>
                prevPage.page < prevPage.totalPages && prevPage.page + 1,
        },
    });
}

export default useSearch;

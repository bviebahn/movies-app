import useUser from "./useUser";
import { useInfiniteQuery } from "react-query";
import { fetchTmdb, convertAccountLists } from "./util";
import { AccountList } from "./types";

export type AccountListsResult = {
    page: number;
    totalPages: number;
    totalResults: number;
    results: ReadonlyArray<AccountList>;
};

async function fetchAccountLists(
    _key: string,
    accountId: string,
    accessToken: string,
    page: number = 1
): Promise<AccountListsResult> {
    const response = await fetchTmdb(
        `/account/${accountId}/lists?page=${page}`,
        {
            version: 4,
            accessToken,
        }
    );

    if (response.ok) {
        const result = await response.json();
        return {
            page: result.page,
            totalPages: result.total_pages,
            totalResults: result.total_results,
            results: convertAccountLists(result.results),
        };
    }

    throw new Error("Error fetching account lists");
}

function useAccountLists(
    { enabled }: { enabled: boolean } = { enabled: true }
) {
    const { accountId, accessToken } = useUser();

    return useInfiniteQuery(
        ["account-lists", accountId!, accessToken!],
        fetchAccountLists,
        {
            enabled: enabled && accountId && accessToken,
            getFetchMore: (prevPage: any) =>
                prevPage.page < prevPage.totalPages && prevPage.page + 1,
        }
    );
}

export default useAccountLists;

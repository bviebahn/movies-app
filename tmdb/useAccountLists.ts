import { useInfiniteQuery } from "react-query";
import { AccountList } from "./types";
import useUser from "./useUser";
import { convertAccountLists, fetchTmdb } from "./util";

export type AccountListsResult = {
    page: number;
    totalPages: number;
    totalResults: number;
    results: ReadonlyArray<AccountList>;
};

async function fetchAccountLists(
    accountId: string | undefined,
    accessToken: string | undefined,
    page: number = 1
): Promise<AccountListsResult> {
    if (!accountId) {
        throw new Error("Error fetching account lists: missing accountId");
    }
    if (!accessToken) {
        throw new Error("Error fetching account lists: missing accessToken");
    }
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

    throw new Error("Error fetching account lists: response not ok");
}

function useAccountLists(
    { enabled }: { enabled: boolean } = { enabled: true }
) {
    const { accountId, accessToken } = useUser();

    return useInfiniteQuery(
        ["account-lists", accountId, accessToken],
        () => fetchAccountLists(accountId, accessToken),
        {
            enabled: enabled && !!accountId && !!accessToken,
            getNextPageParam: prevPage =>
                prevPage.page < prevPage.totalPages && prevPage.page + 1,
        }
    );
}

export default useAccountLists;

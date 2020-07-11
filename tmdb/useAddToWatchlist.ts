import useUser from "./useUser";
import { fetchTmdb } from "./util";
import { useMutation, queryCache, AnyQueryKey } from "react-query";
import { MovieDetails, TvShowDetails } from "./types";

async function addToWatchlist({
    userId,
    sessionId,
    mediaType,
    mediaId,
    watchlist,
}: {
    userId: number;
    sessionId: string;
    mediaType: "movie" | "tv";
    mediaId: number;
    watchlist: boolean;
}) {
    const response = await fetchTmdb(
        `/account/${userId}/watchlist?session_id=${sessionId}`,
        {
            method: "POST",
            body: {
                media_type: mediaType,
                media_id: mediaId,
                watchlist,
            },
        }
    );
    if (response.ok) {
        return { success: true, watchlist };
    }
    throw new Error("Error adding to watchlist");
}

function useAddToWatchlist() {
    const { sessionId, user } = useUser();
    const [mutate] = useMutation(addToWatchlist, {
        onMutate: ({ mediaType, mediaId, watchlist }): (() => void) => {
            const queryKey: AnyQueryKey = [
                `${mediaType}-details`,
                mediaId,
                sessionId,
            ];
            const oldDetails = queryCache.getQueryData<
                MovieDetails | TvShowDetails
            >(queryKey);

            if (oldDetails) {
                queryCache.setQueryData<MovieDetails | TvShowDetails>(
                    queryKey,
                    {
                        ...oldDetails,
                        accountStates: {
                            ...oldDetails.accountStates,
                            watchlist,
                        },
                    }
                );
            }

            return () => queryCache.setQueryData(queryKey, oldDetails);
        },
        onError: (_error, _vars, rollback) => (rollback as () => void)(),
    });

    return (mediaType: "movie" | "tv", mediaId: number, watchlist: boolean) => {
        if (!sessionId || !user) {
            throw new Error("Error adding to watchlist - no sessionId or user");
        }
        return mutate({
            sessionId,
            userId: user.id,
            mediaType,
            mediaId,
            watchlist,
        });
    };
}

export default useAddToWatchlist;

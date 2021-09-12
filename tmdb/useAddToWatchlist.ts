import { useMutation, useQueryClient } from "react-query";
import QueryKeys from "../util/queryKeys";
import { MovieDetails, TvShowDetails } from "./types";
import useUser from "./useUser";
import { fetchTmdb } from "./util";

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
    const queryClient = useQueryClient();

    const { mutate } = useMutation(addToWatchlist, {
        onMutate: ({
            mediaType,
            mediaId,
            watchlist,
        }: Parameters<typeof addToWatchlist>[0]) => {
            const queryKey =
                mediaType === "movie"
                    ? QueryKeys.MovieDetails(mediaId, sessionId)
                    : QueryKeys.TvDetails(mediaId, sessionId);
            const oldDetails = queryClient.getQueryData<
                MovieDetails | TvShowDetails
            >(queryKey);

            if (oldDetails) {
                queryClient.setQueryData<MovieDetails | TvShowDetails>(
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

            return {
                previousData: oldDetails,
            };
        },
        onError: (_error, vars, context) => {
            if (context) {
                const queryKey =
                    vars.mediaType === "movie"
                        ? QueryKeys.MovieDetails(vars.mediaId, sessionId)
                        : QueryKeys.TvDetails(vars.mediaId, sessionId);
                queryClient.setQueryData<
                    MovieDetails | TvShowDetails | undefined
                >(queryKey, context.previousData);
            }
        },
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

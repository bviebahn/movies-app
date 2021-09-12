import { useMutation, useQueryClient } from "react-query";
import QueryKeys from "../util/queryKeys";
import { MovieDetails, TvShowDetails } from "./types";
import useUser from "./useUser";
import { fetchTmdb } from "./util";

async function markAsFavorite({
    userId,
    sessionId,
    mediaType,
    mediaId,
    favorite,
}: {
    userId: number;
    sessionId: string;
    mediaType: "movie" | "tv";
    mediaId: number;
    favorite: boolean;
}) {
    const response = await fetchTmdb(
        `/account/${userId}/favorite?session_id=${sessionId}`,
        {
            method: "POST",
            body: {
                media_type: mediaType,
                media_id: mediaId,
                favorite,
            },
        }
    );
    if (response.ok) {
        return { success: true, favorite };
    }
    throw new Error("Error marking as favorite");
}

function useMarkAsFavorite() {
    const { sessionId, user } = useUser();
    const queryClient = useQueryClient();

    const { mutate } = useMutation(markAsFavorite, {
        onMutate: ({
            mediaType,
            mediaId,
            favorite,
        }: Parameters<typeof markAsFavorite>[0]) => {
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
                            favorite,
                        },
                    }
                );
            }

            return { previousData: oldDetails };
        },
        onError: (_error, vars, context) => {
            const queryKey =
                vars.mediaType === "movie"
                    ? QueryKeys.MovieDetails(vars.mediaId, sessionId)
                    : QueryKeys.TvDetails(vars.mediaId, sessionId);
            if (context) {
                queryClient.setQueryData<
                    MovieDetails | TvShowDetails | undefined
                >(queryKey, context.previousData);
            }
        },
    });

    return (mediaType: "movie" | "tv", mediaId: number, favorite: boolean) => {
        if (!sessionId || !user) {
            throw new Error("Error marking as favorite - no sessionId or user");
        }
        return mutate({
            sessionId,
            userId: user.id,
            mediaType,
            mediaId,
            favorite,
        });
    };
}

export default useMarkAsFavorite;

import useUser from "./useUser";
import { fetchTmdb } from "./util";
import { useMutation, queryCache } from "react-query";
import { MovieDetails, TvShowDetails } from "./types";

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
        },
    );
    if (response.ok) {
        return { success: true, favorite };
    }
    throw new Error("Error marking as favorite");
}

function useMarkAsFavorite() {
    const { sessionId, user } = useUser();
    const [mutate] = useMutation(markAsFavorite, {
        onMutate: ({ mediaType, mediaId, favorite }): (() => void) => {
            const oldDetails = queryCache.getQueryData<
                MovieDetails | TvShowDetails
            >([`${mediaType}-details`, mediaId]);

            if (oldDetails) {
                queryCache.setQueryData<MovieDetails | TvShowDetails>(
                    [`${mediaType}-details`, mediaId],
                    {
                        ...oldDetails,
                        accountStates: {
                            ...oldDetails.accountStates,
                            favorite,
                        },
                    },
                );
            }

            return () =>
                queryCache.setQueryData(
                    [`${mediaType}-details`, mediaId],
                    oldDetails,
                );
        },
        onError: (_error, _vars, rollback) => (rollback as () => void)(),
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

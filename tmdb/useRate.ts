import useUser from "./useUser";
import { fetchTmdb } from "./util";
import { useMutation, queryCache } from "react-query";
import { MovieDetails, TvShowDetails } from "./types";

async function rate({
    sessionId,
    mediaType,
    mediaId,
    rating,
}: {
    sessionId: string;
    mediaType: "movie" | "tv";
    mediaId: number;
    rating?: number;
}) {
    const response = await fetchTmdb(
        `/${mediaType}/${mediaId}/rating?session_id=${sessionId}`,
        { method: rating ? "POST" : "DELETE", body: { value: rating } },
    );
    if (response.ok) {
        return { success: true, rating };
    }
    throw new Error("Error rating");
}

function useRate() {
    const { sessionId } = useUser();
    const [mutate] = useMutation(rate, {
        onMutate: ({ mediaType, mediaId, rating }): (() => void) => {
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
                            rated: rating || 0,
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

    return (mediaType: "movie" | "tv", mediaId: number, rating?: number) => {
        if (!sessionId) {
            throw new Error("Error rating - no sessionId");
        }
        return mutate({
            sessionId,
            mediaType,
            mediaId,
            rating,
        });
    };
}

export default useRate;

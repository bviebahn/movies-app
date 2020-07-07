import useUser from "./useUser";
import { fetchTmdb } from "./util";
import { useMutation, queryCache } from "react-query";
import { MovieDetails, TvShowDetails, SeasonDetails } from "./types";

type Variables = { rating?: number } & (
    | {
          mediaType: "movie" | "tv";
          mediaId: number;
      }
    | {
          mediaType: "episode";
          tvId: number;
          seasonNumber: number;
          episodeNumber: number;
      }
);

async function rate(variables: Variables & { sessionId: string }) {
    const { mediaType, rating, sessionId } = variables;
    const path =
        variables.mediaType === "episode"
            ? `/tv/${variables.tvId}/season/${variables.seasonNumber}/episode/${variables.episodeNumber}`
            : `/${mediaType}/${variables.mediaId}`;

    const response = await fetchTmdb(`${path}/rating?session_id=${sessionId}`, {
        method: rating ? "POST" : "DELETE",
        body: { value: rating },
    });
    if (response.ok) {
        return { success: true, rating };
    }

    throw new Error("Error rating");
}

function useRate() {
    const { sessionId } = useUser();

    const [mutate] = useMutation(rate, {
        onMutate: (variables) => {
            const { mediaType, rating } = variables;
            if (variables.mediaType === "episode") {
                const { tvId, seasonNumber, episodeNumber } = variables;
                const seasonDetails = queryCache.getQueryData<SeasonDetails>([
                    "season-details",
                    tvId,
                    seasonNumber,
                ]);

                if (seasonDetails) {
                    queryCache.setQueryData<SeasonDetails>(
                        ["season-details", tvId, seasonNumber],
                        {
                            ...seasonDetails,
                            accountStates: seasonDetails.accountStates?.map(
                                (accState) =>
                                    accState.epiodeNumber === episodeNumber
                                        ? {
                                              ...accState,
                                              rated: rating || 0,
                                          }
                                        : accState,
                            ),
                        },
                    );
                    return () =>
                        queryCache.setQueryData(
                            ["season-details", tvId, seasonNumber],
                            seasonDetails,
                        );
                }
            } else {
                const { mediaId } = variables;
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
                    return () =>
                        queryCache.setQueryData(
                            [`${mediaType}-details`, mediaId],
                            oldDetails,
                        );
                }
            }
        },
        onError: (_error, _vars, rollback) =>
            rollback && (rollback as () => void)(),
    });

    return (variables: Variables) => {
        if (!sessionId) {
            throw new Error("Error rating - no sessionId");
        }

        return mutate({ ...variables, sessionId } as any);
    };
}

export default useRate;

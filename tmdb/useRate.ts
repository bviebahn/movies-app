import { useMutation, useQueryClient } from "react-query";
import QueryKeys from "../util/queryKeys";
import { MovieDetails, SeasonDetails, TvShowDetails } from "./types";
import useUser from "./useUser";
import { fetchTmdb } from "./util";

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
    console.log("vars", variables);

    throw new Error("Error rating");
}

function useRate() {
    const { sessionId } = useUser();
    const queryClient = useQueryClient();

    const { mutate } = useMutation(rate, {
        onMutate: (variables: Parameters<typeof rate>[0]) => {
            const { rating } = variables;
            if (variables.mediaType === "episode") {
                const { tvId, seasonNumber, episodeNumber } = variables;
                const queryKey = QueryKeys.SeasonDetails(
                    tvId,
                    seasonNumber,
                    sessionId
                );
                const seasonDetails = queryClient.getQueryData<SeasonDetails>(
                    queryKey
                );

                if (seasonDetails) {
                    queryClient.setQueryData<SeasonDetails>(queryKey, {
                        ...seasonDetails,
                        accountStates: seasonDetails.accountStates?.map(
                            accState =>
                                accState.epiodeNumber === episodeNumber
                                    ? {
                                          ...accState,
                                          rated: rating || 0,
                                      }
                                    : accState
                        ),
                    });
                    return { previousData: seasonDetails };
                }
            } else {
                const { mediaId } = variables;
                const queryKey =
                    variables.mediaType === "movie"
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
                                rated: rating || 0,
                            },
                        }
                    );
                    return {
                        previousData: oldDetails,
                    };
                }
            }
        },
        onError: (_error, vars, context) => {
            if (context) {
                const queryKey =
                    vars.mediaType === "episode"
                        ? QueryKeys.SeasonDetails(
                              vars.tvId,
                              vars.seasonNumber,
                              sessionId
                          )
                        : vars.mediaType === "movie"
                        ? QueryKeys.MovieDetails(vars.mediaId, sessionId)
                        : QueryKeys.TvDetails(vars.mediaId, sessionId);

                queryClient.setQueryData<
                    MovieDetails | TvShowDetails | SeasonDetails
                >(queryKey, context.previousData);
            }
        },
    });

    return (variables: Variables) => {
        if (!sessionId) {
            throw new Error("Error rating - no sessionId");
        }

        return mutate({ ...variables, sessionId });
    };
}

export default useRate;

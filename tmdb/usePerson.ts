import { useQuery } from "react-query";
import QueryKeys from "../util/queryKeys";
import { convertPersonDetails, fetchTmdb } from "./util";

async function fetchPersonDetails(id: number) {
    const response = await fetchTmdb(
        `/person/${id}?append_to_response=combined_credits`
    );

    if (response.ok) {
        const result = await response.json();
        return convertPersonDetails(result);
    }

    throw new Error("Error fetch person details");
}

function usePersonDetails(id: number) {
    return useQuery(QueryKeys.PersonDetails(id), () => fetchPersonDetails(id));
}

export default usePersonDetails;

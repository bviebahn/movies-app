import { fetchTmdb, convertPersonDetails } from "./util";
import { useQuery } from "react-query";

async function fetchPersonDetails(_key: string, id: number) {
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
    return useQuery(["person-details", id], fetchPersonDetails);
}

export default usePersonDetails;

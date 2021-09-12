import useConfiguration from "./useConfiguration";
import { ImageType, ImageSize } from "./types";

function useImageUrl() {
    const { data: configuration } = useConfiguration();

    function getImageUrl(path: string, type: ImageType, size: ImageSize) {
        if (!configuration) {
            return undefined;
        }
        const {
            images: {
                backdropSizes,
                secureBaseUrl,
                logoSizes,
                posterSizes,
                profileSizes,
                stillSizes,
            },
        } = configuration;

        const matchingArray = (() => {
            switch (type) {
                case "backdrop":
                    return backdropSizes;
                case "logo":
                    return logoSizes;
                case "poster":
                    return posterSizes;
                case "profile":
                    return profileSizes;
                case "still":
                    return stillSizes;
            }
        })();

        const index = (() => {
            switch (size) {
                case "small":
                    return matchingArray.length - 4;
                case "medium":
                    return matchingArray.length - 3;
                case "large":
                    return matchingArray.length - 2;
                case "original":
                    return matchingArray.length - 1;
            }
        })();

        // just to be sure
        const matchingSize =
            matchingArray[
                Math.min(Math.max(index, 0), matchingArray.length - 1)
            ];

        return `${secureBaseUrl}${matchingSize}${path}`;
    }

    return getImageUrl;
}

export default useImageUrl;

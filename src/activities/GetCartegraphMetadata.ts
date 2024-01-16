import type { IActivityHandler } from "@vertigis/workflow";
import { CartegraphService } from "../CartegraphService";
import { getResponseError } from "../CartegraphRequestError";

interface GetCartegraphMetadataInputs {
    /* eslint-disable @typescript-eslint/no-redundant-type-constituents */

    /**
     * @description The Cartegraph REST API Service.
     * @required
     */
    service?: CartegraphService;

    /**
     * @description Cartegraph class name. For example, cgSignsClass.
     * @required
     */
    className?: "cgSignsClass" | string;

    /* eslint-enable @typescript-eslint/no-redundant-type-constituents */
}

interface GetCartegraphMetadataOutputs {
    /**
     * @description The result of the REST API request.
     */
    result: Record<string, object[]>;
}

/**
 * @category Cartegraph
 * @defaultName cgMetadata
 * @description Allows a client to view the business object class and property metadata.
 * @clientOnly
 * @supportedApps EXB, GWV, GVH, WAB
 */
export default class GetCartegraphMetadata implements IActivityHandler {
    async execute(
        inputs: GetCartegraphMetadataInputs,
    ): Promise<GetCartegraphMetadataOutputs> {
        const { className, service } = inputs;
        if (!service) {
            throw new Error("service is required");
        }
        if (!className) {
            throw new Error("className is required");
        }

        // https://yourserver.com/cartegraph/api/v1/meta/Classes/{className}
        const url = new URL(
            `${service.url}/api/v1/meta/Classes/${encodeURIComponent(
                className,
            )}`,
        );

        const response = await fetch(url, {
            method: "get",
            credentials: "include",
        });

        const error = await getResponseError(response);
        if (error) {
            throw error;
        }

        return {
            result: await response.json(),
        };
    }
}

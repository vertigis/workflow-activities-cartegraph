import type { IActivityHandler } from "@vertigis/workflow";
import { CartegraphService } from "../CartegraphService";
import { getResponseError } from "../CartegraphRequestError";

interface DeleteCartegraphRecordInputs {
    /* eslint-disable @typescript-eslint/no-redundant-type-constituents */

    /**
     * @description The Cartegraph REST API Service.
     * @required
     */
    service: CartegraphService;

    /**
     * @description Cartegraph class name. For example, cgSignsClass,
     * @required
     */
    className: "cgSignsClass" | string;

    /**
     * @displayName ID
     * @description Oid of the record.
     */
    id?: number;

    /**
     * @description Filter to apply to the delete.
     */
    filter: string;

    /* eslint-enable @typescript-eslint/no-redundant-type-constituents */
}

interface DeleteCartegraphRecordOutputs {
    /**
     * @description The result of the REST API request.
     */
    result: {
        DeletedRecordCount: number;
    };
}

/**
 * @category Cartegraph
 * @defaultName cgDelete
 * @description Delete one or more records for a recordset using a filter.
 * @clientOnly
 * @supportedApps EXB, GWV, GVH, WAB
 */
export default class DeleteCartegraphRecord implements IActivityHandler {
    async execute(
        inputs: DeleteCartegraphRecordInputs,
    ): Promise<DeleteCartegraphRecordOutputs> {
        const { className, filter, id, service } = inputs;
        if (!service) {
            throw new Error("service is required");
        }
        if (!className) {
            throw new Error("className is required");
        }

        //https://yourserver.com/cartegraph/api/v1/classes/cgSignsClass?filter=(([MUTCDCode\Classification] is equal to "Regulatory"))
        const url = new URL(
            `${service.url}/api/v1/classes/${encodeURIComponent(className)}`,
        );
        if (typeof id === "number") {
            url.pathname += `/${id}`;
        }
        filter && url.searchParams.append("filter", filter);

        const response = await fetch(url, {
            method: "delete",
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

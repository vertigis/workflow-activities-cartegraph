import type { IActivityHandler } from "@vertigis/workflow";
import { CartegraphService } from "../CartegraphService";

interface DeleteCartegraphRecordInputs {
    /**
     * @description The Cartegraph REST API Service.
     * @required
     */
    service: CartegraphService;

    /**
     * @description Cartegraph class name (for example, cgSignsClass)
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
}

interface DeleteCartegraphRecordOutputs {
    /**
     * @description The result of the activity.
     */
    result: {
        DeletedRecordCount: number;
    };
}

/**
 * @category Cartegraph
 * @description Delete one or more records for a recordset using a filter.
 * @clientOnly
 * @supportedApps EXB, GWV, GVH, WAB
 */
export default class DeleteCartegraphRecord implements IActivityHandler {
    async execute(inputs: DeleteCartegraphRecordInputs): Promise<DeleteCartegraphRecordOutputs> {
        const { className, filter, id, service } = inputs;
        if (!service) {
            throw new Error("service is required");
        }
        if (!className) {
            throw new Error("className is required");
        }

        //https://yourserver.com/cartegraph/api/v1/classes/cgSignsClass?filter=(([MUTCDCode\Classification] is equal to "Regulatory"))
        const url = new URL(`${service.url}/api/v1/classes/${encodeURIComponent(className)}`);
        if (id) {
            url.pathname += `/${id}`;
        }
        filter && url.searchParams.append("filter", filter);

        const response = await fetch(url, {
            method: "delete",
        });

        return {
            result: await response.json(),
        };
    }
}

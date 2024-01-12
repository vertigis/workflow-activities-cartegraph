import type { IActivityHandler } from "@vertigis/workflow";
import { CartegraphService } from "../CartegraphService";

interface GetCartegraphRecordInputs {
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
     * @description Cartegraph class name (for example, cgSigns_cgInspectionsClass)
     */
    childClassName: "cgSigns_cgInspectionsClass" | string;

    filter: string;
    fields: string;
    sort: string;
}

interface GetCartegraphRecordOutputs {
    /**
     * @description The result of the activity.
     */
    result: any;
}

/**
 * @category Cartegraph
 * @description Retrieve a list of one or more records of a recordset.
 * @clientOnly
 * @supportedApps EXB, GWV, GVH, WAB
 */
export default class GetCartegraphRecord implements IActivityHandler {
    async execute(
        inputs: GetCartegraphRecordInputs,
    ): Promise<GetCartegraphRecordOutputs> {
        const { childClassName, className, fields, filter, id, service, sort } =
            inputs;
        if (!service) {
            throw new Error("service is required");
        }
        if (!className) {
            throw new Error("className is required");
        }

        // https://yourserver.com/cartegraph/api/v1/classes/{className}/{id}/{childClassName}
        const url = new URL(
            `${service.url}/api/v1/classes/${encodeURIComponent(className)}`,
        );
        if (id) {
            url.pathname += `/${encodeURIComponent(id)}`;
            if (childClassName) {
                url.pathname += `/${encodeURIComponent(childClassName)}`;
            }
        }
        fields && url.searchParams.append("fields", fields);
        filter && url.searchParams.append("filter", filter);
        sort && url.searchParams.append("sort", sort);
        // TODO: limit, offset, currentLocationLatitude, currentLocationLongitude, bypassRoleBasedFiltering, ignoreNullFields

        const response = await fetch(url, {
            method: "get",
        });

        return {
            result: await response.json(),
        };
    }
}

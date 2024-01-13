import type { IActivityHandler } from "@vertigis/workflow";
import { CartegraphService } from "../CartegraphService";
import { getResponseError } from "../CartegraphRequestError";

interface GetCartegraphRecordInputs {
    /* eslint-disable @typescript-eslint/no-redundant-type-constituents */

    /**
     * @description The Cartegraph REST API Service.
     * @required
     */
    service: CartegraphService;

    /**
     * @description Cartegraph class name. For example, cgSignsClass.
     * @required
     */
    className: "cgSignsClass" | string;

    /**
     * @displayName ID
     * @description Oid of the record.
     */
    id?: number;

    /**
     * @description Cartegraph class name. For example, cgSigns_cgInspectionsClass.
     */
    childClassName?: "cgSigns_cgInspectionsClass" | string;

    /**
     * @description The filter to apply to the select operation.
     */
    filter?: string;

    /**
     * @description Comma separated list of fields to return. For example, Oid,CgProximity,IDField.
     */

    fields?: string;

    /**
     * @description Sort order to be applied to the returned list of records. For example, IDField:asc,MUTCDCodeField:dsc,CgProximity:asc. The default is Oid:asc.
     */
    sort?: string;

    /**
     * @description Number of records to return. The default number of records returned is 1000, unless otherwise specified.
     */
    limit?: number;

    /**
     * @description Number of records to skip.
     */
    offset?: number;

    /**
     * @description Current latitude position of the client.
     */
    currentLocationLatitude?: number;

    /**
     * @description Current longitude position of the client.
     */
    currentLocationLongitude?: number;

    /**
     * @description Indicate that recordset filters configured for the logged on user's role should be bypassed.
     */
    bypassRoleBasedFiltering?: boolean;

    /**
     * @description When set to true, any fields with a value of null or "" will not be returned.
     */
    ignoreNullFields?: boolean;

    /* eslint-enable @typescript-eslint/no-redundant-type-constituents */
}

interface GetCartegraphRecordOutputs {
    /**
     * @description The result of the REST API request.
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
        const {
            bypassRoleBasedFiltering,
            childClassName,
            className,
            currentLocationLatitude,
            currentLocationLongitude,
            fields,
            filter,
            id,
            ignoreNullFields,
            limit,
            offset,
            service,
            sort,
        } = inputs;
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
        limit && url.searchParams.append("limit", limit.toString());
        offset && url.searchParams.append("offset", offset.toString());
        currentLocationLatitude &&
            url.searchParams.append(
                "currentLocationLatitude",
                currentLocationLatitude.toString(),
            );
        currentLocationLongitude &&
            url.searchParams.append(
                "currentLocationLongitude",
                currentLocationLongitude.toString(),
            );
        bypassRoleBasedFiltering &&
            url.searchParams.append(
                "bypassRoleBasedFiltering",
                bypassRoleBasedFiltering.toString(),
            );
        ignoreNullFields &&
            url.searchParams.append(
                "ignoreNullFields",
                ignoreNullFields.toString(),
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

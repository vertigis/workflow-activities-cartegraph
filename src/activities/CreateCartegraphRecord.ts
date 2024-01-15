import type { IActivityHandler } from "@vertigis/workflow";
import { CartegraphService } from "../CartegraphService";
import { getResponseError } from "../CartegraphRequestError";

interface CreateCartegraphRecordInputs {
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
     * @description The content of the record to create.
     * @required
     */
    content: Record<string, any>;

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
     * @description When set to true, any fields with a value of null or "" will not be returned.
     */
    ignoreNullFields?: boolean;

    /* eslint-enable @typescript-eslint/no-redundant-type-constituents */
}

interface CreateCartegraphRecordOutputs {
    /**
     * @description The result of the REST API request.
     */
    result: Record<string, object[]>;
}

/**
 * @category Cartegraph
 * @defaultName cgCreateRecords
 * @description Create one or more records for a recordset.
 * @clientOnly
 * @supportedApps EXB, GWV, GVH, WAB
 */
export default class CreateCartegraphRecord implements IActivityHandler {
    async execute(
        inputs: CreateCartegraphRecordInputs,
    ): Promise<CreateCartegraphRecordOutputs> {
        const { childClassName, className, id, content, service } = inputs;
        if (!service) {
            throw new Error("service is required");
        }
        if (!className) {
            throw new Error("className is required");
        }
        if (!content) {
            throw new Error("content is required");
        }

        // https://yourserver.com/cartegraph/api/v1/classes/{className}/{id}/{childClassName}
        const url = new URL(
            `${service.url}/api/v1/classes/${encodeURIComponent(className)}`,
        );
        if (typeof id === "number") {
            url.pathname += `/${encodeURIComponent(id)}`;
            if (childClassName) {
                url.pathname += `/${encodeURIComponent(childClassName)}`;
            }
        }

        const response = await fetch(url, {
            method: "post",
            credentials: "include",
            body: JSON.stringify(content),
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

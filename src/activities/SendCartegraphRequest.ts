import type { IActivityHandler } from "@vertigis/workflow";
import { CartegraphService } from "../CartegraphService";
import { getResponseError } from "../CartegraphRequestError";

interface SendCartegraphRequestInputs {
    /* eslint-disable @typescript-eslint/no-redundant-type-constituents */

    /**
     * @description The Cartegraph REST API Service.
     * @required
     */
    service: CartegraphService;

    /**
     * @description The HTTP request method.
     * @required
     */
    method: "GET" | "POST" | "PUT" | "DELETE";

    /**
     * @description The Cartegraph REST API resource or operation to request.
     * @required
     */
    path:
        | "api/v1/authenticate/signout"
        | "api/v1/classes/{className}"
        | "api/v1/classes/{className}/{id}"
        | "api/v1/classes/{className}/{id}/{childClassName}"
        | "api/v1/attachments/{className}/{id}"
        | "api/v1/attachments/{className}/{id}/{childClassName}"
        | "api/v1/attachments/primary/{className}/{id}"
        | "api/v1/attachments/primary/thumbnail/{className}/{id}"
        | "api/v1/attachments/thumbnail/{className}/{id}"
        | string;

    /**
     * @description The query string parameters to send on the request.
     */
    query?: {
        [key: string]: string | number | boolean;
    };

    /**
     * @description The body of the request.
     */
    body?: {
        [key: string]: any;
    };

    /**
     * @description The headers to send on the request.
     */
    headers?: {
        [key: string]: string;
    };

    /* eslint-enable @typescript-eslint/no-redundant-type-constituents */
}

interface SendCartegraphRequestOutputs {
    /**
     * @description The result of the REST API request.
     */
    result: any;
}

/**
 * @category Cartegraph
 * @defaultName cartegraphRequest
 * @description Sends a request to the Cartegraph REST API.
 * @clientOnly
 * @supportedApps EXB, GWV, GVH, WAB
 */
export default class SendCartegraphRequest implements IActivityHandler {
    async execute(
        inputs: SendCartegraphRequestInputs,
    ): Promise<SendCartegraphRequestOutputs> {
        const { body, headers, method, path, query, service } = inputs;
        if (!service) {
            throw new Error("service is required");
        }
        if (!method) {
            throw new Error("method is required");
        }
        if (!path) {
            throw new Error("path is required");
        }

        const url = new URL(`${service.url}/${path}`);
        if (query) {
            for (const [key, value] of Object.entries(query)) {
                url.searchParams.append(key, value?.toString() || "");
            }
        }

        const response = await fetch(url, {
            method,
            body: body ? JSON.stringify(body) : undefined,
            credentials: "include",
            headers: {
                ...(body ? { "Content-Type": "application/json" } : undefined),
                ...headers,
            },
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

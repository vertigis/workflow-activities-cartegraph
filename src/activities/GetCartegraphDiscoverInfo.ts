import type { IActivityHandler } from "@vertigis/workflow";
import { CartegraphService } from "../CartegraphService";
import { getResponseError } from "../CartegraphRequestError";

interface GetCartegraphDiscoverInfoInputs {
    /**
     * @description The Cartegraph REST API Service.
     * @required
     */
    service?: CartegraphService;
}

interface GetCartegraphDiscoverInfoOutputs {
    /**
     * @description The result of the REST API request.
     */
    result: {
        Library: {
            SingularName: string;
            PluralName: string;
            ClassName: string;
        }[];
        Asset: {
            SingularName: string;
            PluralName: string;
            ClassName: string;
        }[];
        Resource: {
            SingularName: string;
            PluralName: string;
            ClassName: string;
        }[];
        Request: {
            SingularName: string;
            PluralName: string;
            ClassName: string;
        }[];
        Work: {
            SingularName: string;
            PluralName: string;
            ClassName: string;
        }[];
    };
}

/**
 * @category Cartegraph
 * @defaultName cgDiscoverInfo
 * @description Displays top level recordset information for the following categories Library, Asset, Resource, Request, and Work.
 * @clientOnly
 * @supportedApps EXB, GWV, GVH, WAB
 */
export default class GetCartegraphDiscoverInfo implements IActivityHandler {
    async execute(
        inputs: GetCartegraphDiscoverInfoInputs,
    ): Promise<GetCartegraphDiscoverInfoOutputs> {
        const { service } = inputs;
        if (!service) {
            throw new Error("service is required");
        }

        const response = await fetch(`${service.url}/api/v1/discover`, {
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

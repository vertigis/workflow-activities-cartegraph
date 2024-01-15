import type { IActivityHandler } from "@vertigis/workflow";
import { CartegraphService } from "../CartegraphService";
import { getResponseError } from "../CartegraphRequestError";

interface GetCartegraphUserInfoInputs {
    /**
     * @description The Cartegraph REST API Service.
     * @required
     */
    service: CartegraphService;
}

interface GetCartegraphUserInfoOutputs {
    /**
     * @description The result of the REST API request.
     */
    result: {
        UserName: string;
        EsriUsername: string;
        FirstName: string;
        LastName: string;
        Email: string;
        Role: string;
        IdentityLevel: number;
    };
}

/**
 * @category Cartegraph
 * @defaultName cgUser
 * @description Allows a client to gather various information about the currently signed in user.
 * @clientOnly
 * @supportedApps EXB, GWV, GVH, WAB
 */
export default class GetCartegraphUserInfo implements IActivityHandler {
    async execute(
        inputs: GetCartegraphUserInfoInputs,
    ): Promise<GetCartegraphUserInfoOutputs> {
        const { service } = inputs;
        if (!service) {
            throw new Error("service is required");
        }

        const response = await fetch(`${service.url}/api/v1/user`, {
            method: "get",
            credentials: "include",
        });

        const error = await getResponseError(response);
        if (error) {
            throw error;
        }

        const result = await response.json();
        return {
            result,
        };
    }
}

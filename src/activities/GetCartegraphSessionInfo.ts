import type { IActivityHandler } from "@vertigis/workflow";
import { CartegraphService } from "../CartegraphService";
import { getResponseError } from "../CartegraphRequestError";

interface GetCartegraphSessionInfoInputs {
    /**
     * @description The Cartegraph REST API Service.
     * @required
     */
    service?: CartegraphService;
}

interface GetCartegraphSessionInfoOutputs {
    /**
     * @description Whether the user is signed in.
     */
    isAuthenticated: boolean;
    /**
     * @description The result of the REST API request.
     */
    result: {
        Expires: number;
        Cookie: string;
        CurrentAuthTokenExpiration: number;
        MaintenanceLevel: number;
        MaintenanceMessage: string;
        MaintenanceUser: string;
        MaintenanceUserFullName: string;
        RestrictUsersDuringMaintenance: boolean;
    };
}

/**
 * @category Cartegraph
 * @defaultName cgSession
 * @description Allows a client to check information about the current session.
 * @clientOnly
 * @supportedApps EXB, GWV, GVH, WAB
 */
export default class GetCartegraphSessionInfo implements IActivityHandler {
    async execute(
        inputs: GetCartegraphSessionInfoInputs,
    ): Promise<GetCartegraphSessionInfoOutputs> {
        const { service } = inputs;
        if (!service) {
            throw new Error("service is required");
        }

        const response = await fetch(`${service.url}/api/v1/authenticate`, {
            method: "get",
            credentials: "include",
        });

        const error = await getResponseError(response);
        if (error) {
            throw error;
        }

        const result =
            (await response.json()) as GetCartegraphSessionInfoOutputs["result"];
        return {
            isAuthenticated: !!result.Cookie,
            result,
        };
    }
}

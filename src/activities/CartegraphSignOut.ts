import type { IActivityHandler } from "@vertigis/workflow";
import { CartegraphService } from "../CartegraphService";

interface CartegraphSignOutInputs {
    /**
     * @description The Cartegraph REST API Service.
     * @required
     */
    service: CartegraphService;
}

interface CartegraphSignOutOutputs {}

/**
 * @category Cartegraph
 * @description Signs the current user out of Cartegraph.
 * @clientOnly
 * @supportedApps EXB, GWV, GVH, WAB
 */
export default class CartegraphSignOut implements IActivityHandler {
    async execute(
        inputs: CartegraphSignOutInputs,
    ): Promise<CartegraphSignOutOutputs> {
        const { service } = inputs;
        if (!service) {
            throw new Error("service is required");
        }

        const response = await fetch(
            `${service.url}/api/v1/authenticate/signout`,
            {
                method: "post",
                credentials: "include",
            },
        );

        if (!response.ok) {
            throw new Error("Unable to sign out of Cartegraph service.");
        }

        return {};
    }
}

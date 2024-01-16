import type { IActivityHandler } from "@vertigis/workflow";
import { CartegraphService } from "../CartegraphService";

interface CartegraphSignInInputs {
    /**
     * @description The Cartegraph REST API Service.
     * @required
     */
    service?: CartegraphService;

    /**
     * @description The username.
     * @required
     */
    username?: string;

    /**
     * @description The password.
     * @required
     */
    password?: string;

    /**
     * @description Boolean should be true to check for Internal Request role security.
     */
    isInternalRequest?: boolean;
}

interface CartegraphSignInOutputs {
    /**
     * @description The result of the REST API request.
     */
    result: {
        LogOnStatus: number;
        Expires: number;
    };
}

/**
 * @category Cartegraph
 * @defaultName cgSignIn
 * @description Signs a user into Cartegraph using their username and password.
 * @clientOnly
 * @supportedApps EXB, GWV, GVH, WAB
 */
export default class CartegraphSignIn implements IActivityHandler {
    async execute(
        inputs: CartegraphSignInInputs,
    ): Promise<CartegraphSignInOutputs> {
        const { isInternalRequest, password, service, username } = inputs;
        if (!service) {
            throw new Error("service is required");
        }
        if (!username) {
            throw new Error("username is required");
        }
        if (!password) {
            throw new Error("password is required");
        }

        const response = await fetch(`${service.url}/api/v1/authenticate`, {
            method: "post",
            body: JSON.stringify({
                userName: username,
                password,
                isInternalRequest,
            }),
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Unable to authenticate with Cartegraph service.");
        }

        return {
            result: await response.json(),
        };
    }
}

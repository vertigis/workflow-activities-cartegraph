import type { IActivityHandler } from "@vertigis/workflow";
import { CartegraphService } from "../CartegraphService";

interface CreateCartegraphServiceInputs {
    /**
     * @displayName URL
     * @description The URl of the Cartegraph REST API.
     * @required
     */
    url: "https://yourserver.com/cartegraph" | string;

    /**
     * @description The first input to the activity.
     * @required
     */
    username: string;

    /**
     * @description The second input to the activity.
     * @required
     */
    password?: string;

    /**
     * @description Boolean should be true to check for Internal Request role security.
     */
    isInternalRequest;
}

interface CreateCartegraphServiceOutputs {
    /**
     * @description The Cartegraph service that can be supplied to other Cartegraph activities.
     */
    service: CartegraphService;
}

/**
 * @category Cartegraph
 * @defaultName cartegraphService
 * @description Creates an authenticated connection to a Cartegraph service that can be used with other Cartegraph activities.
 * @clientOnly
 * @supportedApps EXB, GWV, GVH, WAB
 */
export default class CreateCartegraphService implements IActivityHandler {
    async execute(
        inputs: CreateCartegraphServiceInputs,
    ): Promise<CreateCartegraphServiceOutputs> {
        const { isInternalRequest, password, url, username } = inputs;
        if (!url) {
            throw new Error("url is required");
        }
        if (!username) {
            throw new Error("username is required");
        }
        if (!password) {
            throw new Error("password is required");
        }

        const normalizedUrl = url.replace(/\/*$/, "");

        const response = await fetch(`${normalizedUrl}/api/v1/authenticate`, {
            method: "post",
            body: new URLSearchParams({
                userName: username,
                password,
                isInternalRequest,
            }),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Unable to authenticate with Cartegraph service.");
        }

        return {
            service: {
                url: normalizedUrl,
            },
        };
    }
}

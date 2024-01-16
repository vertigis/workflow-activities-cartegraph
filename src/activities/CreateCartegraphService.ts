import type { IActivityHandler } from "@vertigis/workflow";
import { CartegraphService } from "../CartegraphService";

interface CreateCartegraphServiceInputs {
    /* eslint-disable @typescript-eslint/no-redundant-type-constituents */

    /**
     * @displayName URL
     * @description The URL of the Cartegraph REST API.
     * @required
     */
    url?: "https://yourserver.com/cartegraph" | string;

    /* eslint-enable @typescript-eslint/no-redundant-type-constituents */
}

interface CreateCartegraphServiceOutputs {
    /**
     * @description The Cartegraph service that can be supplied to other Cartegraph activities.
     */
    service: CartegraphService;
}

/**
 * @category Cartegraph
 * @defaultName cgService
 * @description Creates an authenticated connection to a Cartegraph service that can be used with other Cartegraph activities.
 * @clientOnly
 * @supportedApps EXB, GWV, GVH, WAB
 */
export default class CreateCartegraphService implements IActivityHandler {
    execute(
        inputs: CreateCartegraphServiceInputs,
    ): CreateCartegraphServiceOutputs {
        const { url } = inputs;
        if (!url) {
            throw new Error("url is required");
        }

        const normalizedUrl = url.replace(/\/*$/, "");

        return {
            service: {
                url: normalizedUrl,
                signInUrl: `${normalizedUrl}/Account/ShowSignIn`,
            },
        };
    }
}

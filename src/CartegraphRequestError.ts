export interface CartegraphErrorResponse {
    Message: string;
    Errors?: {
        GUID: string;
        FieldName: string;
        Message: string;
    }[];
}

export class CartegraphRequestError extends Error {
    readonly error?: CartegraphErrorResponse;
    readonly statusCode: number;
    constructor(
        statusCode: number,
        error?: CartegraphErrorResponse,
        message?: string,
    ) {
        super(message || "Cartegraph request failed.");
        this.error = error;
        this.statusCode = statusCode;
    }
}

export async function getResponseError(response: Response) {
    if (!response.ok) {
        // Try to read the error body of the response
        let responseBody: CartegraphErrorResponse | undefined;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            try {
                responseBody = await response.json();
            } catch {
                // Swallow errors reading the response so that we don't mask the original failure
            }
        }
        return new CartegraphRequestError(response.status, responseBody);
    }
}

export interface CartegraphErrorResponse {
    Message: string;
    Errors?: {
        GUID: string;
        FieldName: string;
        Message: string;
    }[];
}

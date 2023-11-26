export function jsonResponse(statusCode:number, body: any){
    return{
        statusCode,
        body,
    };
};
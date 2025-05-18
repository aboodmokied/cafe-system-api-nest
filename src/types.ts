export type AuthPayload={
    sub:number;
    email:string;
    jti: any, // unique identifier
}

export enum OrderTypes{
    card="CARD",
    charging="CHARGING",
    other="OTHER",
}
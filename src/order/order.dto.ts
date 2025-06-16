export class GetOrdersDto{
    sessionId:number
}

class AddOrderDto{
    sessionId:number;
    type: 'CARD'|'CHARGING'|'OTHER';
}

export class AddCardOrderDto extends AddOrderDto{
    type: "CARD";
    cardId:number;
}

export class AddChargingOrderDto extends AddOrderDto{
    type: "CHARGING";
}

export class StopChargingOrderDto{
    orderId:number;
    price:number;
    endAt:Date
}

export class AddOtherOrderDto extends AddOrderDto{
    type: "OTHER";
    title:string;
    price:number;
}


export class RemoveOrderDto{
    orderId:number;
};


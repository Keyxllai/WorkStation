export class Item{
    sku: string;
    brand: string;
    name: string;
    price: number;
    inventory:WarehouseInventory[];
}

export class WarehouseInventory{
    warehouse: string;
    count:number;
}
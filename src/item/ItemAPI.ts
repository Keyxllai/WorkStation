import { BaseRouter } from "./../http/BaseRouter";
import { ItemBusiness } from "./ItemBusiness";

export class ItemAPI extends BaseRouter {
    path: string;
    itemBusiness: ItemBusiness;

    constructor(options: any) {
        super(options);
        this.path = options['path'];

        this.itemBusiness = new ItemBusiness(null);
    }

    createRouter() {
        if (!this.httpServer || !this.httpServer.workStation)
            return;
        var app = this.httpServer.app;
        let ib = this.itemBusiness;
        app.post(this.url + "/retrieve", function (req, rsp) {
            var data: any = ["Item"];
            try {
                data = ib.populateItems();
            } catch (error) {

            }
            if (!data)
                data = [];
            rsp.send(data);
        });
    }
}
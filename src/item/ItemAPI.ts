import { BaseRouter } from "./../http/BaseRouter";
import { ItemBusiness } from "./ItemBusiness";
import { ServiceContext } from "../base/ServiceContext";

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
        let itemretrieveurl = this.url;
        app.get(itemretrieveurl, function (req, rsp) {
            let ctx = new ServiceContext(itemretrieveurl, req, rsp);
            try {
                ib.populateItems(ctx);
            } catch (error) {
                // send MQ to handle Error
            }
            finally {
                ctx.response.writeHead(200, { 'Content-Type': 'application/json' });
                ctx.response.end(JSON.stringify(ctx.result));
            }
        });

        let stockUrl = this.url + "/stock";
        app.post(stockUrl, function (req, rsp) {
            let ctx = new ServiceContext(itemretrieveurl, req, rsp);
            try {
                ib.stockItems(ctx);
            } catch (error) {
                // send MQ to handle Error
            }
            finally {
                ctx.response.writeHead(200, { 'Content-Type': 'application/json' });
                ctx.response.end(JSON.stringify(ctx.result));
            }
        });

        let singelItemDetailUrl = this.url + "/:id"
        app.get(singelItemDetailUrl, async function (req, rsp) {
            let ctx = new ServiceContext(itemretrieveurl, req, rsp);
            try {
               await ib.getItemDetail(ctx);
            } catch (error) {
                // send MQ to handle Error
            }
            finally {
                ctx.response.writeHead(200, { 'Content-Type': 'application/json' });
                ctx.response.end(JSON.stringify(ctx.result));
            }
        });
    }
}
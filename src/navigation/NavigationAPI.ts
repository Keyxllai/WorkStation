import { BaseRouter } from "./../http/BaseRouter";
import { NavigationBusiness } from "./NavigationBusiness";
import { ServiceContext } from "../base/ServiceContext";

export class NavigationAPI extends BaseRouter {
    path: string;
    naviBiz: NavigationBusiness;

    constructor(options: any) {
        super(options);
        this.path = options['path'];

        this.naviBiz = new NavigationBusiness(null);
    }



   createRouter() {
        if (!this.httpServer || !this.httpServer.workStation)
            return;
        var app = this.httpServer.app;
        let biz = this.naviBiz;
        let itemretrieveurl = this.url;
        app.get(itemretrieveurl, function (req, rsp) {
            let ctx = new ServiceContext(itemretrieveurl, req, rsp);
            try {
                biz.buildNavitationTree(ctx);
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
import { BaseRouter, IHttpHandler } from "./BaseRouter";

export class ServiceAPI extends BaseRouter {

    constructor() {
        super({ url: '/api' });
    }

    createRouter() {
        if (!this.httpServer)
            return;
        if (!this.httpServer.workStation)
            return;
        var app = this.httpServer.app;
        var services = this.httpServer.workStation.serviceManager.services;

        app.post(this.url, function (req, res) {
            var flag = false;
            for (const key in services) {
                if (services.hasOwnProperty(key)) {
                    const service: any = services[key];
                    if (!service) {
                        continue;
                    }
                    var handler: IHttpHandler = service;
                    if (handler.canHandleHttp && handler.canHandleHttp(req.body.url)) {
                        flag = true;
                        handler.handleHttp(req.body.url, req, res);
                    }
                }
            }
            if(!flag){
                console.log('Invalid request.');
                res.writeHead(404);
                res.end();
            }
        });
    }
}
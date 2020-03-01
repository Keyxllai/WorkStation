import { BaseRouter } from "./../http/BaseRouter";
import { Config } from "./../base/Config";

export class ConfigAPI extends BaseRouter {
    path: string;
    constructor(options: any) {
        super(options);
        this.path = options['path'];
    }

    createRouter() {
        if (!this.httpServer || !this.httpServer.workStation)
            return;
        var app = this.httpServer.app;
        var ws = this.httpServer.workStation;
        app.get(this.url, function (req, res) {
            var data: any = []
            try {
                if (ws.serviceManager.configService) {
                    data = ws.serviceManager.configService.configs;
                }
            } catch (error) {

            }
            if (!data)
                data = [];
            res.send(data);
        });
    }
}
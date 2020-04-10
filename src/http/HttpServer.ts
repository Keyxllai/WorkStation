import { WorkStationService } from "./../service/WorkStationService";
import express from "express";
import expressWs from "express-ws";
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import http from 'http';
import { BaseRouter } from "./BaseRouter";
import { ServiceAPI } from "./ServiceAPI";
import { ConfigAPI } from "./../config/ConfigAPI";
import { StaticSource } from "./StaticSource";

export class HttpServer extends WorkStationService {
    routerKey: string = "workstation/routers";
    options: any;
    port: number;

    app: express.Application;
    server!: http.Server;

    routers!: { [key: string]: BaseRouter }

    constructor(options: any) {
        super();
        this.options = options;
        this.port = options['port'];
        this.app = express();
        this.routers = {};

        //var router = express.Router();
        expressWs(this.app);
        //expressWs(router);
    }

    beforeConfig() {
        var app = this.app;
        app.use(bodyParser.urlencoded({
            limit: '5000mb',
            extended: true
        }));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(logger("combined"));
        app.use(cors());
    }

    start() {
        this.configRouters();
        let app = this.app;
        let port = this.port;  //TODO
        app.set('port', port)
        this.server = app.listen(port, function () {
            console.log("Express server listening on port " + app.get('port'));
        });

    }

    restart() {
        let app = this.app;
        let port = this.port;  //TODO
        this.server.close();
        app.set('port', port)
        this.server = app.listen(port, function () {
            console.log("Express server listening on port " + app.get('port'));
        });
    }

    private configRouters() {
        let that = this;
        let routers = that.workStation.serviceManager.addinBuilder.buildObjects(that.routerKey);

        routers.forEach(function (router: any) {
            if (router.id) {
                that.routers[router.id] = router;
            }
        });

        for (const key in that.routers) {
            if (that.routers.hasOwnProperty(key)) {
                const router = that.routers[key];
                if (!router) {
                    continue;
                }
                router.httpServer = that;
                router.createRouter();
                if (router.init) {
                    router.init();
                }
            }
        }
    }

}
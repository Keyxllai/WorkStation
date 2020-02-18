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

export class HttpServer extends WorkStationService {

    options: any;

    app: express.Application;
    server!: http.Server;

    routers!: { [key: string]: BaseRouter }

    constructor(options: any) {
        super();
        this.options = options;
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
        app.use(logger("combined"));
        app.use(cors());

        // TODO
        var serviceRouter = new ServiceAPI();
        this.routers['serviceApi'] = serviceRouter;

        var configApiRouter = new ConfigAPI();
        this.routers['configApiRouter'] = configApiRouter;
        
    }

    start(){
        this.configRouters();
        let app = this.app;
        let port = 8083;  //TODO
        this.server = app.listen(port, function(){
            console.log("Express server listening on port " + app.get('port'));
        });

    }

    private configRouters(){
        for (const key in this.routers) {
            if (this.routers.hasOwnProperty(key)) {
                const router = this.routers[key];
                if(!router){
                    continue;
                }
                router.httpServer = this;
                router.createRouter();
            }
        }
    }

}
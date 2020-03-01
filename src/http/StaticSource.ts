import { BaseRouter } from "./BaseRouter";
import express from 'express';
import path from 'path';

export class StaticSource extends BaseRouter {
    path: string;
    constructor(options: any) {
        super(options);
        this.path = options['path'];
    }

    createRouter() {
        if (!this.httpServer)
            return;
        let app = this.httpServer.app;
        let fpath = path.join(__dirname, this.path);
        app.use(this.url, express.static(fpath));
    }
}
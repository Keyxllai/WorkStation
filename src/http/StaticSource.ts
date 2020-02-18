import { BaseRouter } from "./BaseRouter";
import express from 'express';
import path from 'path';

export class StaticSource extends BaseRouter {
    path: string;
    constructor(url: string, path: string) {
        super({ url: url });
        this.path = path;
    }

    createRouter() {
        if(!this.httpServer)
        return;
        let app = this.httpServer.app;
        let fpath = path.join(__dirname,this.path);
        app.use(this.url,express.static(fpath));
    }
}
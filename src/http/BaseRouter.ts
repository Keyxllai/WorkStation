import { HttpServer } from "./HttpServer";

export interface IHttpHandler {
    canHandleHttp(url: string): boolean;
    handleHttp(url: string, req: any, res: any): void;
}

export class BaseRouter{

    httpServer!: HttpServer;
    url!: string;

    constructor(options:any){
        if (options) {
            this.url = options['url'];
        }
    }

    /**
     * createRouter
     */
    public createRouter() {
        
    }

}
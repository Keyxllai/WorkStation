import { GeneralResponse } from "./GeneralResponse";


export class ServiceContext {
    url!: string;
    requestBody: any = {};

    request: any;
    response: any;

    result!: GeneralResponse;

    constructor(url: any, request: any, response: any) {
        let self = this;

        self.url = url;
        if (request.body) {
            self.requestBody = request.body;
        }

        self.request = request;
        self.response = response;

        self.result = {}
    }

    Log(msg: any) {
        this.LogResponse('INFO', msg);
    }

    Error(msg: any) {
        this.LogResponse('ERRO', msg);
    }

    Warn(msg: any) {
        this.LogResponse('WARN', msg);
    }

    Debug(msg: any) {
        this.LogResponse('DBUG', msg);
    }

    protected LogResponse(type: string, message: string) {
        if (!this.result.logs)
            this.result.logs = [];
        let msg = '[' + new Date().toTimeString() + '] [' + type + '] ' + message;

        this.result.logs.push(msg);
    }
}
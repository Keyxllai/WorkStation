import { WorkStationService } from "./../service/WorkStationService";
import { IHttpHandler } from "./../http/BaseRouter";
import { FileSystemConfig } from "./../base/Config";
import { ServiceContext } from "./../base/ServiceContext.";

export class FileService extends WorkStationService implements IHttpHandler {

    fileSystemConfig!: FileSystemConfig;

    constructor() {
        super();

    }

    canHandleHttp(url: string): boolean {
        //return true;
        switch (url) {
            case "file/getFolders":
                return true;
            case "file/getWorkSpaces":
                return true;
            default:
                return false;
        }
    }

    handleHttp(url: string, req: any, res: any): void {
        let ctx = new ServiceContext(url, req, res);
        switch (url) {
            case "file/getFolders":
                this.getFolders(ctx);
                break;
            case "file/getWorkSpaces":
                this.getWorkSpace(ctx);
                break;
        }
    }

    beforeConfig() {
        let configService = this.workStation.serviceManager.configService;

        this.fileSystemConfig = configService.getConfig("FileSystemConfig", FileSystemConfig.defaultFileSystemConfig());
    }



    getFolders(ctx: ServiceContext) {
        console.log('GetFolders');
        ctx.response.writeHead(200, { 'Content-Type': 'application/json' });
        ctx.response.end("FileAPI is working");
    }

    getWorkSpace(ctx: ServiceContext) {
        ctx.response.writeHead(200, { 'Content-Type': 'application/json' });
        ctx.response.end(JSON.stringify(this.fileSystemConfig.drivers));
    }


}
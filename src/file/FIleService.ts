import { WorkStationService } from "./../service/WorkStationService";
import { IHttpHandler } from "./../http/BaseRouter";
import { FileSystemConfig } from "./../base/Config";

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
        switch (url) {
            case "file/getFolders":
                this.getFolders(req, res);
                break;
            case "file/getWorkSpaces":
                this.getWorkSpace(req, res);
                break;
        }
    }

    beforeConfig() {
        let configService = this.workStation.serviceManager.configService;

        this.fileSystemConfig = configService.getConfig("FileSystemConfig", FileSystemConfig.defaultFileSystemConfig());
    }



    getFolders(req: any, res: any) {
        console.log('GetFolders');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end("FileAPI is working");
    }

    getWorkSpace(req: any, res: any) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(this.fileSystemConfig.drivers));
        
    }


}
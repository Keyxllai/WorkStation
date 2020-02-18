import { WorkStationService } from "./../service/WorkStationService";
import { IHttpHandler } from "./../http/BaseRouter";

export class FileService extends WorkStationService implements IHttpHandler {


    canHandleHttp(url: string): boolean {
        return true;
        switch (url) {
            case "file/getFolders":
                return true;
            default:
                return false;
        }
    }

    handleHttp(url: string, req: any, res: any): void {
        switch (url) {
            case "file/getFolders":
                this.getFolders(req,res);
                break;
        }
    }

    getFolders(req: any, res: any) {
        console.log('GetFolders');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end("FileAPI is working");
    }


}
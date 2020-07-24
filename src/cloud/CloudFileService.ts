import { WorkStationService } from "./../service/WorkStationService";
import { IHttpHandler } from "./../http/BaseRouter";

export class CloudFileService extends WorkStationService implements IHttpHandler{
    canHandleHttp(url: string): boolean {
        switch (url) {
            case "cloud/workspace/":
            case "cloud/workspace":
            
                return true;
            default:
                return false;
        }
    }
    handleHttp(url: string, req: any, res: any): void {
        throw new Error("Method not implemented.");
    }

}
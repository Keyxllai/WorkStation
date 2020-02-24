import { WorkStationService } from "./../service/WorkStationService";
import { IHttpHandler } from "./../http/BaseRouter";
import { FileSystemConfig } from "./../base/Config";
import { ServiceContext } from "./../base/ServiceContext.";
import { WorkSpace, WorkSpaceFolder } from "./../base/Models";
import * as fs from "fs";
import * as path from "path";

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
        try {
            ctx.Log("Receive Request.");
            let drivers = this.fileSystemConfig.drivers;
            let workspaces: WorkSpace[] = [];
            if (!drivers) {
                ctx.Warn("No drivers configed");
                return;
            }
            for (let driver of drivers) {
                if (driver.type != 'local') {
                    ctx.Warn("Current not support driver Type: " + driver.type);
                    return;
                }
                let workSpaces = driver.workspaces;
                if (!workSpaces) {
                    ctx.Warn("driver [" + driver.name + "] no workspace configed");
                    continue;
                }
                for (let ws of workSpaces) {
                    ws.driveId = driver.id;
                    ws.driveName = driver.name;
                    let result = this.pickupFolders(ws, ws.path, ctx);
                    if (result.length > 0) {
                        ws.folders = result;
                    }
                    workspaces.push(ws);
                }
            }
            ctx.result.result = workspaces;
            ctx.result.success = true;
        } catch (error) {
            ctx.Error('Encount error: ' + error.message)
            ctx.result.success = false;
        }
        finally {
            ctx.response.writeHead(200, { 'Content-Type': 'application/json' });
            ctx.response.end(JSON.stringify(ctx.result));
        }
    }

    pickupFolders(workspace: WorkSpace, filepath: string, ctx: ServiceContext): WorkSpaceFolder[] {
        try {
            let folders: WorkSpaceFolder[] = [];
            let fds: any = {};
            if (!fs.existsSync(filepath)) {
                ctx.Log("File path not exist");
                return folders;
            }

            let files = fs.readdirSync(filepath);

            for (let file of files) {
                if (file[0] == '.' || file == 'node_modules') {
                    ctx.Warn("This folder [" + file + "] would be ignored.")
                    continue;
                }
                var filedir = path.join(filepath, file);
                var stats = fs.statSync(filedir);
                var isDir = stats.isDirectory();
                if (isDir) {
                    let f = new WorkSpaceFolder();
                    f.folderName = file;
                    f.path = filedir;
                    f.virtualPath = workspace.driveName + "\\" + workspace.name + "\\" + path.relative(workspace.path, filedir);

                    let subFs = this.pickupFolders(workspace, filedir, ctx);
                    if (subFs.length > 0) {
                        f.subFolders = subFs;
                    }
                    folders.push(f);
                    fds[file] = {};
                }
            }
            // return fds;
            return folders;
        } catch (error) {
            return [];
        }
    }


}
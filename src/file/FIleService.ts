import { WorkStationService } from "./../service/WorkStationService";
import { IHttpHandler } from "./../http/BaseRouter";
import { FileSystemConfig } from "./../base/Config";
import { ServiceContext } from "./../base/ServiceContext.";
import { WorkSpace, WorkSpaceFolder, WorkSpaceFile } from "./../base/Models";
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
            case "file/getWorkSpaces":
            case "file/getFiles":
                return true;
            default:
                return false;
        }
    }

    handleHttp(url: string, req: any, res: any): void {
        let ctx = new ServiceContext(url, req, res);
        switch (url) {
            case "file/getWorkSpaces":
                this.getWorkSpace(ctx);
                break;
            case "file/getFiles":
                this.getFolderFiles(ctx);
                break;
            case "file/deleteFiles":
                //this.getFolderFiles(ctx);
                break;
        }
    }

    beforeConfig() {
        let configService = this.workStation.serviceManager.configService;

        this.fileSystemConfig = configService.getConfig("FileSystemConfig", FileSystemConfig.defaultFileSystemConfig());
    }

    /**
     * Request body need contain: "url":"file/getWorkSpaces"
     * Build Folder Tree for all WorkSpace that belong to local drive base on file system configuration, 
     * please specify FileSystemConfig Node in config.json file. 
     * this API just retrieve folder info to improve query performance
     *
     * @param {ServiceContext} ctx
     * @returns Folder Tree
     * @memberof FileService
     */
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

    /**
     * Request body need cotain: "url":"file/getFiles"
     * get file infomations with speicfic virtual path;
     * eg. virtualpath: "LocalDriver\\WorkSpaceName\\trgit"
     * virtual path must specify driver name and workspace name
     * @param {ServiceContext} ctx
     * @returns get workspace file infomations
     * @memberof FileService
     */
    getFolderFiles(ctx: ServiceContext) {
        try {
            let workspace = this.getWorkSpaceByVirtualPath(ctx.requestBody.virtualpath, ctx);
            if (!workspace) {
                ctx.Warn("Not Found relative WorkSpace for path: " + ctx.requestBody.virtualpath)
                return;
            }
            let relativePath = this.getRelativePath(ctx.requestBody.virtualpath);
            let folderRealPath = path.join(workspace.path, relativePath);
            let files = this.retrieveFilesWithRealPath(folderRealPath, ctx);
            files?.forEach(file => {
                file.workspace = workspace.name;
                file.driver = workspace.driveName;
                file.virtualPath = ctx.requestBody.virtualpath;
            })
            ctx.result.result = files;
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

    private pickupFolders(workspace: WorkSpace, filepath: string, ctx: ServiceContext): WorkSpaceFolder[] {
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

    private getRelativePath(virtualPath: string): string {
        let strs = virtualPath.split('/');
        if (strs.length < 2) {
            return "";
        }
        let res = strs.slice(2);
        return res.join("/");
    }

    private getWorkSpaceByVirtualPath(virtualPath: string, ctx: ServiceContext): WorkSpace | null {
        try {
            let strs = virtualPath.split('/');
            if (strs.length < 2) {
                ctx.Warn("VirtualPath [" + virtualPath + "] Incorrect, must contain driver and workspace name like local/workspace.");
            }

            let workspacename = strs[1];
            let drivername = strs[0];
            var result: any = null;
            this.fileSystemConfig.drivers?.forEach(item => {
                if (!item.workspaces || item.name != drivername) {
                    return;
                }
                item.workspaces.forEach(workspace => {
                    if (workspace.name != workspacename) {
                        return;
                    }
                    result = workspace;
                })
            })
            return result;

        } catch (error) {
            return null;
        }

    }

    private retrieveFilesWithRealPath(filepath: string, ctx: ServiceContext) {
        try {
            let fileInfos: WorkSpaceFile[] = []
            if (!fs.existsSync(filepath)) {
                ctx.Error("Path [" + filepath + "] not exist.")
                return;
            }
            let files = fs.readdirSync(filepath);
            ctx.Debug("Total [" + files.length + "] files be found in path: " + filepath);
            files.forEach(filename => {
                if (filename[0] == '.') {
                    ctx.Warn("   >>> [" + filename + "] would be ignored.");
                    return;
                }
                ctx.Debug("   >>> Handle file: " + filename);
                let fileFullPath = path.join(filepath, filename);
                let stats = fs.statSync(fileFullPath);
                let extName = path.extname(fileFullPath);
                fileInfos.push({
                    id: stats.gid.toString(),
                    name: filename,
                    realPath: fileFullPath,
                    virtualPath: '',
                    createTime: stats.birthtime,
                    isDirectory: stats.isDirectory(),
                    size: stats.size,
                    extname: extName,
                    workspace: '',
                    driver: ''
                })
            });
            return fileInfos;
        } catch (error) {
            ctx.Error("Encount Errr in retrieveFilesWithRealPath with msg: " + error.message);
            return [];
        }
    }
}
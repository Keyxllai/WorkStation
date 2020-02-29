import { ServiceManager } from "./../Base/ServiceManager";
import { ConfigService } from "./../config/ConfigService";
import { WorkStation } from "./../workstation/WorkStation"
import { HttpServer } from "./../http/HttpServer";
import { FileService } from "../file/FileService";
import { PluginService } from "./../plugin/PluginService";
import { AddinBuilder } from "./../base/addin/AddinBuilder";

export class WorkStationServiceManager extends ServiceManager {
    serviceKey: string = "workstation/services";
    public addinBuilder!: AddinBuilder;
    workStation!: WorkStation;
    configService!: ConfigService;
    //httpService!: HttpServer;
    fileService!: FileService;
    pluginService!: PluginService;


    constructor(workstation: WorkStation) {
        super();
        this.workStation = workstation;
        this.addinBuilder = new AddinBuilder();
    }

    /**
     * register services
     */
    public registerServices() {
        this.configService = new ConfigService();
        this.services['configService'] = this.configService;
        // this.httpService = new HttpServer({});
        // this.services['httpService'] = this.httpService;
        this.fileService = new FileService();
        this.services['fileService'] = this.fileService;
        this.pluginService = new PluginService();
        this.services['pluginService'] = this.pluginService;

    }

    /**
     * LoadService
     */
    public LoadService() {
        let that = this;
        if (that.addinBuilder == null)
            return;
        let services = this.addinBuilder.buildObjects(this.serviceKey);

        services.forEach(function (service: any) {
            that.services[service.options.id] = service;
        });
    }


    public injectWorkStation() {
        for (const key in this.services) {
            if (this.services.hasOwnProperty(key)) {
                const service = this.services[key];
                if (service == null) {
                    continue;
                }
                if (service.isWorkStationService) {
                    service.workStation = this.workStation;
                }
            }
        }
    }
}
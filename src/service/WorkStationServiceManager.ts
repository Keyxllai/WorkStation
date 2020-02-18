import { ServiceManager } from "./../Base/ServiceManager";
import { ConfigService } from "./../config/ConfigService";
import { WorkStation } from "./../workstation/WorkStation"
import { HttpServer } from "./../http/HttpServer";

export class WorkStationServiceManager extends ServiceManager {

    workStation!: WorkStation;
    configService!: ConfigService;
    httpService!: HttpServer;

    constructor(workstation: WorkStation) {
        super();
        this.workStation = workstation;
    }

    /**
     * register services
     */
    public registerServices() {
        this.configService = new ConfigService();
        this.services['configService'] = this.configService;
        this.httpService = new HttpServer({});
        this.services['httpService'] = this.httpService;
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
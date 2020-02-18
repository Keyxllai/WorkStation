import { ServiceManager } from "./../Base/ServiceManager";
import { ConfigService } from "./../config/ConfigService";
import { WorkStation } from "./../workstation/WorkStation"

export class WorkStationServiceManager extends ServiceManager {

    workStation!: WorkStation;
    configService!: ConfigService;

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
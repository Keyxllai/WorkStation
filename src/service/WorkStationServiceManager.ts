import { ServiceManager } from "./../Base/ServiceManager";
import { ConfigService } from "./../config/ConfigService";

export class WorkStationServiceManager extends ServiceManager{
    configService!: ConfigService;

    constructor(){
        super();
    }

    /**
     * InitDefaultService
     */
    public InitDefaultService() {
        this.configService = new ConfigService();

        this.services['configService'] = this.configService;
    }
}
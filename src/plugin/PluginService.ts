import { WorkStationService } from "./../service/WorkStationService";

export class PluginService extends WorkStationService{

    constructor(){
        super();
    }

    beforeConfig(){
        let configService = this.workStation.serviceManager.configService;
    }
    
}
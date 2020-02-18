import { WorkStation } from "./../workstation/WorkStation";
import { IService } from "./../base/IService";

export class WorkStationService implements IService{
    
    isWorkStationService: boolean;
    workStation!: WorkStation;

    configed: boolean;

    constructor() {
        this.configed = false;
        this.isWorkStationService = true;
    }

    config() {
        if (!this.configed) {
            this.beforeConfig();
        }
        this.configed = true;
    }

    beforeConfig() {

    }

    init() {

    }

    start() {

    }

    stop() {

    }
}
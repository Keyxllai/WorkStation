import { IService } from "./../base/IService";
import { WorkStation } from "./../workstation/WorkStation";

export class WorkStationService implements IService{
    configed: boolean;
    workstation!: WorkStation;
    constructor() {
        this.configed = false;
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
import { IService } from "./../base/IService";

export class WorkStationService implements IService{
    configed: boolean;
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
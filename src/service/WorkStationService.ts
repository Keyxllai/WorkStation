export class WorkStationService {
    configed: boolean;
    constructor() {
        this.configed = false;
    }

    config() {
        if (!this.configed) {
            this.beforeCofig();
        }
        this.configed = true;
    }

    beforeCofig() {

    }

    init() {

    }

    start() {

    }

    stop() {

    }
}
import { WorkStationServiceManager } from "src/service/WorkStationServiceManager";

export class WorkStation {
    serviceManager: WorkStationServiceManager;
    options: any;
    
    constructor(options: any) {
        var self = this;
        self.options = options;
    }

    init(cb?: any) {
        this.serviceManager = new WorkStationServiceManager();
    }


}
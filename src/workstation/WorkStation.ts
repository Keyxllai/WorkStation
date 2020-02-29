import { WorkStationServiceManager } from "./../service/WorkStationServiceManager";
import { IService } from "./../Base/IService";
import { AddinBuilder } from "./../base/addin/AddinBuilder";

export class WorkStation {
    serviceManager!: WorkStationServiceManager;
    options: any;

    constructor(options?: any) {
        var self = this;
        self.options = options;
        self.init();
    }

    getService(id: string): IService {
        return this.serviceManager.services[id];
    }

    init(cb?: any) {
        this.serviceManager = new WorkStationServiceManager(this);
        this.serviceManager.registerDefaultServices();

        let plugins = this.serviceManager.pluginService.getAddins();
        this.serviceManager.addinBuilder.setupPlugins(plugins);
        this.serviceManager.LoadService();

        this.serviceManager.injectWorkStation();


    }

    start() {
        this.serviceManager.configServices();
        this.serviceManager.initServices();
        this.serviceManager.startServices();
        console.log('WorkStation Started.')
    }

    stop() {
        this.serviceManager.stopServices();
    }

    restart(){
        this.stop();
        this.start();
    }
}
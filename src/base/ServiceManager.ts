import { IService } from "./IService";

export class ServiceManager {
    public services: { [key: string]: IService };
    constructor() {
        this.services = {};
    }

    /**
     * addService
     */
    public addService(id: string, service: IService) {
        if (null == service) {
            return;
        }
        this.services[id] = service;
    }

    /**
     * initServices
     */
    public initServices() {
        for (const key in this.services) {
            if (this.services.hasOwnProperty(key)) {
                const service = this.services[key];
                if (null == service)
                    continue;
                if (service.init) {
                    service.init();
                }
            }
        }
    }

    /**
     * configServices
     */
    public configServices() {
        for (const key in this.services) {
            if (this.services.hasOwnProperty(key)) {
                const service = this.services[key];
                if (null == service)
                    continue;
                if (service.config) {
                    service.config();
                }
            }
        }
    }

    /**
     * startServices
     */
    public startServices() {
        for (const key in this.services) {
            if (this.services.hasOwnProperty(key)) {
                const service = this.services[key];
                if (null == service)
                    continue;
                if (service.start) {
                    service.start();
                }
            }
        }
    }

     /**
     * stopServices
     */
    public stopServices() {
        for (const key in this.services) {
            if (this.services.hasOwnProperty(key)) {
                const service = this.services[key];
                if (null == service)
                    continue;
                if (service.stop) {
                    service.stop();
                }
            }
        }
    }
}
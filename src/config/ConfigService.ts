import { WorkStationService } from "./../service/WorkStationService";
import * as path from 'path';
import * as fs from 'fs';
import { WorkStation } from "./../workstation/WorkStation";
import { Config } from "./../base/Config";

export class ConfigService extends WorkStationService {
    configs: { [key: string]: Config };
    configFilePath = "";
    workstation!: WorkStation;

    constructor() {
        super();
        this.configs = {};
    }

    beforeConfig() {
        this.readConfigs();
    }

    private readConfigs() {
        try {
            var rootdir = path.join(__dirname, './../configuration');
            console.log('Setting Path: ' + rootdir);
            if (!fs.existsSync(rootdir)) {
                fs.mkdirSync(rootdir);
            }
            this.configFilePath = path.join(rootdir, 'config.json');

            if (fs.existsSync(this.configFilePath)) {
                let json = fs.readFileSync(this.configFilePath).toString();
                this.configs = JSON.parse(json);
                console.log('Success load config.json:' + this.configFilePath)
            }
            else {
                this.configs = {};
                console.log('No config.json:' + this.configFilePath)
            }
        } catch (error) {

        }
    }

    /**
     * getConfigConfig
     */
    public getConfig(key: string, defaultConfig: Config) {
        if (this.configs[key]) {
            return this.configs[key];
        }
        this.configs[key] = defaultConfig;
        defaultConfig.id = key;
        return defaultConfig;
    }

    start() {
        console.log(this.configs);
        console.log('WKKKK:' + this.workStation.serviceManager.services['configService']);
    }

}
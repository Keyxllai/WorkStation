import { WorkStationService } from "./../service/WorkStationService";
import * as path from "path";
import * as fs from 'fs'

export class PluginService extends WorkStationService {

    addinPath = "";
    constructor() {
        super();
        this.addinPath = path.join(__dirname, "./../", "/configuration/AddinJson.js");
    }

    beforeConfig() {
        let configService = this.workStation.serviceManager.configService;
    }

    public getAddins() {
        try {
            var addins: any = [];
            //var js = fs.readFileSync(this.addinPath).toString();
            //let data = eval(js);

            let data: [] = require(this.addinPath);

            if (data && data.length) {
                data.forEach(item => {
                    addins.push(item);
                })
            }

            return addins;
        } catch (error) {
            console.log(error.message)
        }
    }
}
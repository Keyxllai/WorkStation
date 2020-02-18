import { WorkStationService } from "./../service/WorkStationService";
import * as path from 'path';
import * as fs from 'fs';

export class Setting{
    id:string;
    name:string;
    label:string;
    items: any;
    constructor(){
        this.id = '';
        this.name = '';
        this.label = '';
    }
}

export class ConfigService extends WorkStationService{
    settings:{[key:string]:Setting};
    settingFilePath = "";

    constructor(){
        super();
        this.settings = {};
    }

    beforeConfig(){
        this.getSettings();
    }

    getSettings(){
        try {
            var rootdir = path.join(__dirname,'./../configuration');
            console.log('Setting Path: ' + rootdir);
            if(!fs.existsSync(rootdir)){
                fs.mkdirSync(rootdir);
            }
            this.settingFilePath = path.join(rootdir,'config.json');

            if(fs.existsSync(this.settingFilePath)){
                let json = fs.readFileSync(this.settingFilePath).toString();
                this.settings = JSON.parse(json);
                console.log('Success load config.json:' + this.settingFilePath)
            }
            else{
                this.settings = {};
                console.log('No config.json:' + this.settingFilePath)
            }
        } catch (error) {
            
        }
    }
    
}
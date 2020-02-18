import { WorkStationService } from "./../service/WorkStationService";
import * as path from 'path';
import * as fs from 'fs';
import { WorkStation } from "./../workstation/WorkStation";

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
    workstation!: WorkStation;

    constructor(){
        super();
        this.settings = {};
    }

    beforeConfig(){
        this.readSettings();
    }

    private readSettings(){
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

    /**
     * getSetting
     */
    public getSetting(key:string, defaultSetting: Setting) {
        if(this.settings[key]){
            return this.settings[key];
        }
        this.settings[key] = defaultSetting;
        defaultSetting.id = key;
        return defaultSetting;
    }

    start(){
        console.log(this.settings);
       console.log('WKKKK:'+  this.workstation.serviceManager.services['configService']);
    }
    
}
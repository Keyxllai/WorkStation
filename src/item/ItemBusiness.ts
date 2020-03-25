import * as path from 'path';
import * as fs from 'fs';
import { ServiceContext } from "../base/ServiceContext";
import { Item } from './entity/Item';


export class ItemBusiness{
    items: Item[];

    constructor(options: any){

    }
    
    populateItems(ctx: ServiceContext) {
        try {
            var rootdir = path.join(__dirname, './../configuration');
            ctx.Log("Start to get items from [" + rootdir + "]");
            if (!fs.existsSync(rootdir)) {
                fs.mkdirSync(rootdir);
            }
            let itemfilepath = path.join(rootdir, 'items.json');

            if (fs.existsSync(itemfilepath)) {
                let json = fs.readFileSync(itemfilepath).toString();
                let itemsjson = JSON.parse(json);

                this.items = itemsjson.items;
                ctx.Log("Total ["+ itemsjson.items.length + "] items.")

                ctx.result.result = itemsjson.items;
                ctx.result.success = true;
            }
            else {
                let msg = "Not items be configured in " + itemfilepath;
                ctx.Warn(msg)
                ctx.result.success = false;
                ctx.result.memo = msg;
            }
        } catch (error) {
            ctx.Error('Encount error: ' + error.message)
            ctx.result.success = false;
        }
    }
}
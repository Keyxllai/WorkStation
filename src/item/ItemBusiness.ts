import * as path from 'path';
import * as fs from 'fs';

export class ItemBusiness{
    items: { [key: string]: any };

    constructor(options: any){

    }
    
    populateItems() {
        try {
            var rootdir = path.join(__dirname, './../configuration');
            if (!fs.existsSync(rootdir)) {
                fs.mkdirSync(rootdir);
            }
            let itemfilepath = path.join(rootdir, 'items.json');

            if (fs.existsSync(itemfilepath)) {
                let json = fs.readFileSync(itemfilepath).toString();
                this.items = JSON.parse(json);
                
                console.log('Success load items.json from [' + itemfilepath + ']');

                return this.items;
            }
            else {
                this.items = {};
            }
        } catch (error) {

        }
    }
}
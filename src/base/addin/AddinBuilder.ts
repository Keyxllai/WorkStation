import { Addin, Extension } from "./Addin";

export class AddinBuilder {
    addins: Addin[];
    constructor() {

    }

    setupPlugins(addins: Addin[]) {
        let that = this;
        that.addins = [];
        if (!addins || addins.length < 1) {
            return;
        }
        addins.forEach(item => {
            if (item.disabled) {
                return;
            }
            let addin = new Addin(item, that);
            that.addins.push(addin);
        })
    }

    buildObjects(key: string): any[] {
        let extensions: Extension[] = [];
        for (const addin of this.addins) {
            if (!addin.extensions || addin.extensions.length < 1)
                return;
            addin.extensions.forEach(ext => {
                if (ext.key == key) {
                    extensions.push(ext);
                }
            })
        }
        if (extensions.length < 1)
            return [];
        
        let obs: any[] = [];
        extensions.forEach((extension)=>{
           let os = extension.buildMultipleItemObjects();
           if(os && os.length > 1){
               os.forEach(function(ite){
                   if(ite){
                       obs.push(ite);
                   }
               })
           }
        })
        return obs;
    }
}
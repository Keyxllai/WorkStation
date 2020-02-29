import { Addin, createObject } from "./Addin";

export class ObjectBuilder {
    options: any;

    constructor(options: any) {
        this.options = options;
    }

    buildObject(addin: Addin, objectOps: any) {
        try {
            let objectName = objectOps['object'];
            let ops = objectOps;
            let object: any = null;
            if (objectName) {
                object = createObject(objectName, { args: ops });
            }

            if (object) {
                object['id'] = objectOps['id'];
                object['addin'] = addin;
                return object;
            }
            else {
                return null;
            }
        } catch (error) {
            return null;
        }


    }

    static default = new ObjectBuilder(null);
}
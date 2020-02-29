import { AddinBuilder } from "./AddinBuilder";
import { ObjectBuilder } from "./ObjectBuilder";

export var OBJECT_ROOT: any = typeof window === 'undefined' ? global : window;

export function createObject(objectName: any, op: any = null) {
    op = op || {};

    if (op.useNew === void 0) { op.useNew = true; }
    if (op.root === void 0) { op.root = OBJECT_ROOT; }
    try {
        var obj = op.root;
        var strs = objectName.split('.');
        for (var i = 0; i < strs.length; i++) {
            obj = obj[strs[i]];
            if (obj == null)
                return obj;
        }

        if (op.useNew)
            obj = new obj(op.args);
        return obj;
    }
    catch (_a) {
        return null;
    }
}

export function publicApi(rootName: any, exps: any) {
    var root = OBJECT_ROOT[rootName] || {}
    for (var key in exps)
        root[key] = exps[key];
    OBJECT_ROOT[rootName] = root;
}

export class Addin {
    rawdata: any;
    addinBuilder: AddinBuilder;
    id: string;
    name: string;
    disabled: boolean;
    dirname: string;
    extensions: Extension[];

    constructor(rawdata: any, addinBuilder: AddinBuilder) {
        let that = this;
        that.rawdata = rawdata;
        this.addinBuilder = addinBuilder;
        that.id = rawdata.id;
        that.name = rawdata.name;
        that.disabled = rawdata.disabled;
        this.dirname = rawdata.dirname;
        that.extensions = [];

        if (rawdata.extensions && rawdata.extensions.length) {
            rawdata.extensions.forEach(function (ext: any) {
                let extension = new Extension(that, ext);
                that.extensions.push(extension);
            });
        }
    }
}

export class Extension {
    addin: Addin;
    key: string;
    items: any[];
    constructor(addin: Addin, ext: any) {
        let that = this;
        that.addin = addin;
        that.key = ext.key;
        that.items = [];
        if (ext.items && ext.items.length) {
            ext.items.forEach(function (item: any) {
                let extitem = new ExtensionItem(that.addin, item);
                that.items.push(extitem);
            })
        }
    }

    buildMultipleItemObjects(): any[] {
        let that = this;
        if (that.items.length < 1)
            return [];
        let objs: any[] = [];
        that.items.forEach(item => {
            let ob = item.buildSingleObject();
            objs.push(ob);
        });

        return objs;
    }
}

export class ExtensionItem {
    options: any;
    object: string;
    id: string;
    addin: Addin;
    constructor(addin: Addin, ops: any) {
        this.options = ops;
        this.id = ops.id;
        this.object = ops.object;
        this.addin = addin;
    }

    buildSingleObject() {
        return ObjectBuilder.default.buildObject(this.addin, this.options);
    }

}

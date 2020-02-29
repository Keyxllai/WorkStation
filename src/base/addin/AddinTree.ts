import { Addin } from "./Addin";

export class AddinTree {
    addins: Addin[];
    root: AddinTreeNode;

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
            let addin = new Addin(item, null);
            that.addins.push(addin);
        })
    }

    buildAddinTreeNode() {
        var _this = this;
        _this.root = new AddinTreeNode();
        if (this.addins.length < 1) {
            return;
        }

        for (const addin of _this.addins) {
            let extensions = addin.extensions;
            if (!extensions)
                return;
            for (const extension of extensions) {
                if (!extension.key || !extension.items)
                    return;
                var strs = extension.key.split('/');
                let root = _this.root;
                let current = root;
                let parent = root;
                for (var i = 0; i < strs.length; i++) {
                    if (strs[i] == "")
                        continue;
                    current = parent.children[strs[i]];
                    if (current == null) {
                        current = new AddinTreeNode();
                        parent.children[strs[i]] = current;
                    }
                    parent = current;
                }

                extension.items.forEach(item => {
                    let ext = new ExtendItem(item);
                    current.extendItems.push(ext);
                })
            }
        }
    }

    getTreeNode(key: string): AddinTreeNode {
        var _this = this;
        var keys = key.split('/');
        var root = _this.root;
        var node = root;
        for (var i = 1; i < keys.length; i++) {
            node = node.children[keys[i]];
            if (node == null)
                break;
        }
        return node;
    };

    buildExtensionObject(key: string, objs: any): any[] {
        let node = this.getTreeNode(key);
        if(!node){
            return [];
        }
        return node.buildChildrenObject(objs);
    }
}

export class AddinTreeNode {

    children: { [key: string]: AddinTreeNode };
    extendItems: ExtendItem[];

    constructor() {
        this.children = {};
        this.extendItems = [];
    }

    buildChildrenObject(objs: any): any {
        var objs: any = [];
        this.extendItems.forEach((item) => {
            let obj = item.buildObject(objs);
            //if (obj)
            objs.push(obj);
        });
        return objs;
    }
}

export class ExtendItem {
    options: any;
    id: string;
    constructor(ops: any) {
        this.options = ops;
        this.id = ops.id;
    }
    buildObject(objs: any) {
        var _this = this;
    }
}
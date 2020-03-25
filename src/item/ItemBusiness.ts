import * as path from 'path';
import * as fs from 'fs';
import { ServiceContext } from "../base/ServiceContext";
import { Item } from './entity/Item';
import { Redis } from 'ioredis';
const Redis = require('ioredis');


export class ItemBusiness {
    items: Item[];
    redis: Redis;
    constructor(options: any) {
        this.redis = new Redis();
    }

    populateItems(ctx: ServiceContext) {
        try {
            let items = this.getMetaItems(ctx);

            ctx.result.result = items;
            ctx.result.success = true;
        } catch (error) {
            ctx.Error('Encount error: ' + error.message)
            ctx.result.success = false;
        }
    }

    async getItemDetail(ctx: ServiceContext) {
        try {
            let that = this;
            let id = ctx.request.params.id
            ctx.Log("Check Sku[" + id + "] Exist in Redis");
            let isKeyExist = await that.redis.exists(id);
            if (isKeyExist !== 1) {
                ctx.Warn("This Item Not Exist. [" + id + "]");
                ctx.result.success = false;
                return;
            }
            ctx.Log("sku Exist.")
            let itemDetail = await that.redis.get(id)

            ctx.result.result = JSON.parse(itemDetail);
            ctx.result.success = true;
        } catch (error) {
            ctx.Error('Encount error: ' + error.message)
            ctx.result.success = false;
        }
    }

    stockItems(ctx: ServiceContext) {
        try {
            let that = this;
            let items = this.getMetaItems(ctx);

            items.forEach(function (i: Item) {
                that.redis.set(i.sku, JSON.stringify(i));
            });

            ctx.result.success = true;
            ctx.request.result = true;
        } catch (error) {
            ctx.Error('Encount error: ' + error.message)
            ctx.result.success = false;
        }
    }

    getMetaItems(ctx: ServiceContext) {
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
                ctx.Log("Total [" + itemsjson.items.length + "] items.")

                return itemsjson.items;
            }
            else {
                let msg = "Not items be configured in " + itemfilepath;
                ctx.Warn(msg)
                return [];
            }
        } catch (error) {
            ctx.Error("Encount error during getMetaItems; " + error.message);
        }
    }
}
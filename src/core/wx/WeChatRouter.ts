import { BaseRouter } from "../../http/BaseRouter";
import { ServiceContext } from "../../base/ServiceContext";
import { Redis } from 'ioredis';
import { WeChatBusiness } from "./WeChatBusiness";
const superagent = require('superagent');
const Redis = require('ioredis');


export class WeChatRouter extends BaseRouter {
    wechatsetting: any;
    wechatTokenRequestUrl: string;
    constructor(options: any) {
        super(options);
    }

    init() {
        let configService = this.httpServer.workStation.serviceManager.configService;
        this.wechatsetting = configService.getConfig('WeChatConfig', null);
        this.wechatTokenRequestUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='
            + this.wechatsetting.setting.wechatdev.appid + '&secret=' + this.wechatsetting.setting.wechatdev.appsecret;
    }

    createRouter() {
        let self = this;
        if (!self.httpServer) {
            return;
        }

        let app = self.httpServer.app;
        let tokenurl = this.url + '/token';
        app.get(tokenurl, async function (req, rsp) {
            let ctx = new ServiceContext(tokenurl, req, rsp);

            let biz = new WeChatBusiness({
                wechatTokenUrl: self.wechatTokenRequestUrl
            });
            try {
                let token = await biz.getWeChatToken(ctx);
                ctx.result.result = token;
            } catch (error) {

            }
            finally {
                ctx.response.writeHead(200, { 'Content-Type': 'application/json' });
                ctx.response.end(JSON.stringify(ctx.result));
            }
        });

        let ticketurl = this.url + '/ticket';
        app.get(ticketurl, async function (req, rsp) {
            let ctx = new ServiceContext(tokenurl, req, rsp);

            let biz = new WeChatBusiness({
                wechatTokenUrl: self.wechatTokenRequestUrl
            });
            try {
                let ticket = await biz.getWeChatTicket(ctx);
                ctx.result.result = ticket;
            } catch (error) {

            }
            finally {
                ctx.response.writeHead(200, { 'Content-Type': 'application/json' });
                ctx.response.end(JSON.stringify(ctx.result));
            }
        });
    }
}
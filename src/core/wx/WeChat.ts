import { BaseRouter } from "./../../http/BaseRouter";
import { ServiceContext } from "./../../base/ServiceContext";
import { Redis } from 'ioredis';
const superagent = require('superagent');
const Redis = require('ioredis');


export class WeChat extends BaseRouter {
    wechatsetting: any;
    wechatTokenRequestUrl: string;
    redis: Redis;
    constructor(options: any) {
        super(options);
    }

    init() {
        let configService = this.httpServer.workStation.serviceManager.configService;
        this.wechatsetting = configService.getConfig('WeChatConfig', null);
        this.wechatTokenRequestUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='
            + this.wechatsetting.setting.wechatdev.appid + '&secret=' + this.wechatsetting.setting.wechatdev.appsecret;
        this.redis = new Redis();
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
            try {

                let oldtoken = await self.redis.get('wechat_token');
                if (!Boolean(oldtoken)) {
                    console.log("Redis without wechat token");

                    let newtoken = await self.getAndSetWeChatToken(ctx);
                    if (newtoken.errcode) {
                        ctx.Error("Error Code: " + newtoken.errcode);
                        ctx.Error("Error Message: " + newtoken.errmessage);
                    }
                    else {
                        ctx.Log("New Token: " + JSON.stringify(newtoken));
                        ctx.result.result = newtoken.wechat_token.access_token;
                    }
                }
                else {
                    var old_token = JSON.parse(oldtoken);
                    ctx.Log("Redis wechat old Token: " + old_token.wechat_token.access_token);
                    let ts = (new Date()).getTime() - old_token.creat_time;
                    if (ts > 7170000) {   // 30s后过期
                        let newtoken = await self.getAndSetWeChatToken(ctx);
                        if (newtoken.errcode) {
                            ctx.Error("Error Code: " + newtoken.errcode);
                            ctx.Error("Error Message: " + newtoken.errmessage);
                        }
                        else {
                            ctx.Log("New Token: " + JSON.stringify(newtoken));
                            ctx.result.result = newtoken.wechat_token.access_token;
                        }
                    } else {
                        ctx.result.result = old_token.wechat_token.access_token;
                    }
                }
            } catch (error) {
                // send MQ to handle Error
            }
            finally {
                ctx.response.writeHead(200, { 'Content-Type': 'application/json' });
                ctx.response.end(JSON.stringify(ctx.result));
            }
        });
    }

    async getAndSetWeChatToken(ctx: ServiceContext) {
        let self = this;
        let response = await superagent.get(self.wechatTokenRequestUrl);
        ctx.Log("WeChat API Response: "+ JSON.stringify(response.body));
        let redisToken: any = {};
        if (!response.error && response.statusCode == 200) {
            let newtoken = response.body;
            if (newtoken.errcode) {
                redisToken.errcode = newtoken.errcode;
                redisToken.errmessage = newtoken.errmsg;
                ctx.Error("Request WeChat Tolen Error: " + newtoken.errcode + ". Msg: " + newtoken.errmessage);
            }
            else {
                ctx.Log("Success get WeChat Token:" + newtoken.wechat_token)
                redisToken.wechat_token = newtoken;
                redisToken.creat_time = (new Date()).getTime();
                self.redis.set('wechat_token', JSON.stringify(redisToken));
            }
        }
        else {
            redisToken.errcode = -1;
            redisToken.errmessage = "Request failed";
        }
        return redisToken;
    }

}
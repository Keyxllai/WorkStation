import { ServiceContext } from "../../base/ServiceContext";
import { Redis } from 'ioredis';
const superagent = require('superagent');
const Redis = require('ioredis');

export class WeChatBusiness {
    wechatsetting: any;
    wechatTokenRequestUrl: string;
    wechatTicketRequestUrl: string;
    redis: Redis;
    constructor(ops: any) {
        this.redis = new Redis();
        this.wechatTokenRequestUrl = ops.wechatTokenUrl;
    }

    async getWeChatToken(ctx: ServiceContext) {
        let self = this;
        let oldtoken = await self.redis.get('wechat_token');
        if (!Boolean(oldtoken)) {
            console.log("Redis without wechat token");

            let newtoken = await self.getAndSetWeChatToken(ctx);
            if (newtoken.errcode) {
                ctx.Error("Error Code: " + newtoken.errcode);
                ctx.Error("Error Message: " + newtoken.errmessage);
                return null;
            }
            else {
                ctx.Log("New Token: " + JSON.stringify(newtoken));
                return newtoken.wechat_token.access_token;
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
                    return null;
                }
                else {
                    ctx.Log("old Token invalid, request New Token: " + JSON.stringify(newtoken));
                    return newtoken.wechat_token.access_token;
                }
            } else {
                ctx.Log("Redis wechat old Token Valid: " + old_token.wechat_token.access_token);
                return old_token.wechat_token.access_token;
            }
        }
    }

    async getAndSetWeChatToken(ctx: ServiceContext) {
        let self = this;
        let response = await superagent.get(self.wechatTokenRequestUrl);
        ctx.Log("WeChat API Response: " + JSON.stringify(response.body));
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

    async getWeChatTicket(ctx: ServiceContext) {
        let self = this;
        let oldTicket = await self.redis.get('wechat_ticket');
        if (!Boolean(oldTicket)) {
            console.log("Redis without wechat ticket");

            let newticket = await self.getAndSetWeChatTicket(ctx);
            if (newticket.errcode) {
                ctx.Error("Error Code: " + newticket.errcode);
                ctx.Error("Error Message: " + newticket.errmessage);
                return null;
            }
            else {
                ctx.Log("New Ticket: " + JSON.stringify(newticket));
                return newticket.wechat_ticket.ticket;
            }
        }
        else {
            var old_ticket = JSON.parse(oldTicket);
            ctx.Log("Redis wechat old Ticket: " + old_ticket.wechat_ticket.ticket);
            let ts = (new Date()).getTime() - old_ticket.creat_time;
            if (ts > 7170000) {   // 30s后过期
                let newticket = await self.getAndSetWeChatTicket(ctx);
                if (newticket.errcode) {
                    ctx.Error("Error Code: " + newticket.errcode);
                    ctx.Error("Error Message: " + newticket.errmessage);
                    return null;
                }
                else {
                    ctx.Log("New Ticket: " + JSON.stringify(newticket));
                    return newticket.wechat_ticket.ticket;
                }
            } else {
                return old_ticket.wechat_ticket.ticket;
            }
        }
    }

    async getAndSetWeChatTicket(ctx: ServiceContext) {
        let self = this;
        let token = await self.getWeChatToken(ctx);
        let redisTicket: any = {};
        if (!token) {
            ctx.Error('Get Token encounter error');
            redisTicket.errcode = -2;
            redisTicket.errmessage = "Request Token failed";
            return redisTicket;
        }
        let wechatTicketRequestUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + token + '&type=jsapi'

        let response = await superagent.get(wechatTicketRequestUrl);
        ctx.Log("WeChat ticket API Response: " + JSON.stringify(response.body));
        if (!response.error && response.statusCode == 200) {
            let newticket = response.body;
            if (newticket.errcode) {
                redisTicket.errcode = newticket.errcode;
                redisTicket.errmessage = newticket.errmsg;
                ctx.Error("Request WeChat Tolen Error: " + newticket.errcode + ". Msg: " + newticket.errmessage);
            }
            else {
                ctx.Log("Success get WeChat Ticket:" + newticket.ticket)
                redisTicket.wechat_ticket = newticket;
                redisTicket.creat_time = (new Date()).getTime();
                self.redis.set('wechat_ticket', JSON.stringify(redisTicket));
            }
        }
        else {
            redisTicket.errcode = -1;
            redisTicket.errmessage = "Request failed";
        }
        return redisTicket;
    }


}
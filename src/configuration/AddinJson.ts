import { HttpServer } from "src/http/HttpServer";

let workstation = {
    name: "workstation",
    dirname: __dirname,
    extensions: [
        {
            key: "workstation/services",
            items: [
                {
                    id: "http-server",
                    object: "WS.HttpServer",
                    port: 8082
                },
                {
                    id: "mysqlwrapper",
                    object: "WS.MysqlWrapper",
                }
            ]
        },
        {
            key: "workstation/routers",
            items: [
                {
                    id: "ws-api",
                    object: "WS.ServiceAPI",
                    url: "/api",
                    path: "./"
                },
                {
                    id: "http-folder",
                    object: "WS.StaticSource",
                    url: "/http",
                    path: "./"
                },
                {
                    id: "config-api",
                    object: "WS.ConfigAPI",
                    url: "/api/config",
                    path: "./"
                }
                
            ]
        }
    ]
}

let fileService = {
    name: "fileservice",
    dirname: __dirname,
    extensions: [
        {
            key: "workstation/services",
            items: [
                {
                    id: "file-service",
                    object: "WS.FileService",
                }
            ]
        }
    ]
}

// Test portion with Redis
let itemService ={
    name: "itemservice",
    dirname: __dirname,
    extensions: [
        {
            key: "workstation/routers",
            items: [
                {
                    id: "item-api",
                    object: "WS.ItemAPI",
                    url: "/api/item",
                    path: "./"
                }                
            ]
        }
    ]
}

let wechatService ={
    name: "wechatservice",
    dirname: __dirname,
    extensions: [
        {
            key: "workstation/routers",
            items: [
                {
                    id: "wechat-api",
                    object: "WS.WeChatRouter",
                    url: "/api/wechat",
                    path: "./"
                }
            ]
        }
    ]
}

let navigatinService ={
    name: "navigationservice",
    dirname: __dirname,
    extensions: [
        {
            key: "workstation/routers",
            items: [
                {
                    id: "navigation-api",
                    object: "WS.NavigationAPI",
                    url: "/api/navigation",
                    path: "./"
                }
            ]
        }
    ]
}

let addins = [];
addins.push(workstation);
addins.push(fileService);
addins.push(itemService);
addins.push(wechatService);
addins.push(navigatinService);

module.exports = addins;
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
                    port: 8083
                },
                {
                    id: "mysqlwrapper",
                    object: "WS.MysqlWrapper",
                }
            ]
        },
        {
            key: "workstation/services/routers",
            items: [
                {
                    id: "index",
                    object: "WS.StaticSource",
                    url: "/index",
                    path: "./../"
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

let addins = [];
addins.push(workstation);
addins.push(fileService);

module.exports = addins;
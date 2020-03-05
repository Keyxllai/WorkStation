import * as mainModule from './MainNodeModule'

import * as core from "./base/addin/Addin"
import * as util from "./base/Util"

core.publicApi('WS', mainModule);

import { WorkStation } from "./workstation/WorkStation";

var workstation = new WorkStation();

workstation.start();


const memoryUsage = process.memoryUsage();
const cpuUsage = process.cpuUsage();
console.log("Memory Usage: " + JSON.stringify({
    rss: util.byteToMB(memoryUsage.rss),                // 进程占用内存，包括代码本身、栈、堆
    heapTotal: util.byteToMB(memoryUsage.heapTotal),    // 堆申请到的内存
    heapUsed: util.byteToMB(memoryUsage.heapUsed),      // 堆使用的内存，判断内存泄漏主要依据字段
    external: util.byteToMB(memoryUsage.external),
}));

console.log("CPU Usage: " + JSON.stringify({
    user: util.byteToMB(cpuUsage.user),
    system: util.byteToMB(cpuUsage.system)
}));
import { ServiceContext } from "../base/ServiceContext";
import { NavigationNode } from "./entity/NavigationNode";

export class NavigationBusiness {
    rawNodes: NavigationNode[];
    dbNodes: NavigationNode[];

    constructor(options: any) {
        this.rawNodes = [];
        this.dbNodes = [];
        this.initRawNodes();
        this.initDbNodes();
    }

    // 模拟数据
    initRawNodes() {
        this.rawNodes.push(new NavigationNode({ id: '1-1', pid: '1', name: '上装' }));
        this.rawNodes.push(new NavigationNode({ id: '2-1', pid: '2', name: '上装' }));
        this.rawNodes.push(new NavigationNode({ id: '1-2', pid: '1', name: '下装' }));
        this.rawNodes.push(new NavigationNode({ id: '1-3', pid: '1', name: '鞋' }));
        this.rawNodes.push(new NavigationNode({ id: '5', pid: '1-1', name: '长袖' }));
        this.rawNodes.push(new NavigationNode({ id: '6', pid: '1-1', name: '短袖' }));
        this.rawNodes.push(new NavigationNode({ id: '7', pid: '2-1', name: '背心' }));
        this.rawNodes.push(new NavigationNode({ id: '8', pid: '2-2', name: '长裤' }));
    }

    initDbNodes() {
        this.dbNodes.push(new NavigationNode({ id: '1', name: '男子' }));
        this.dbNodes.push(new NavigationNode({ id: '1-1', pid: '1', name: '上装' }));
        this.dbNodes.push(new NavigationNode({ id: '1-2', pid: '1', name: '下装' }));
        this.dbNodes.push(new NavigationNode({ id: '1-3', pid: '1', name: '鞋' }));
        this.dbNodes.push(new NavigationNode({ id: '1-4', pid: '1', name: '配件' }));
        this.dbNodes.push(new NavigationNode({ id: '2', name: '女子' }));
        this.dbNodes.push(new NavigationNode({ id: '2-1', pid: '2', name: '上装' }));
        this.dbNodes.push(new NavigationNode({ id: '2-2', pid: '2', name: '下装' }));
        this.dbNodes.push(new NavigationNode({ id: '2-3', pid: '2', name: '鞋' }));
        this.dbNodes.push(new NavigationNode({ id: '2-4', pid: '2', name: '配件' }));
    }

    buildNavitationTree(ctx: ServiceContext) {

        // 获取顶级导航节点，并转换为跟平铺节点同样的类型，目的是为了下面递归调用
        let firstlevelNodes = this.getFirstLevelNodes();
        // 直接构建整个导航树
        // this.buildNavitationTreNode(firstlevelNodes, this.rawNodes);

        firstlevelNodes.forEach(element => {
            this.buildNavitationTreNode(element.navigations, this.rawNodes);
        });

        ctx.Log('su');
        ctx.result.result = firstlevelNodes;
    }


    buildNavitationTreNode(navigationNodes: NavigationNode[], allNodes: NavigationNode[]) {
        if (!navigationNodes || navigationNodes.length < 1)
            return;
        for (const index in navigationNodes) {
            //从原始的导航节点(平铺节点list)中找出导航节点下面的子导航节点。
            const node = navigationNodes[index];
            let subNavigationNodes: NavigationNode[] = [];  // 用于存储子导航节点零时变量
            // java可以用for之类循环，目的就是遍历原始list
            allNodes.map(n => {
                // 原始节点pid == 当前节点的id, 则为子导航节点
                if (n.pid === node.id) {
                    subNavigationNodes.push(n);
                }
                // 重要 递归退出条件
                if (subNavigationNodes.length < 1) {
                    return;
                } else {
                    node.navigations = subNavigationNodes;
                    // 有子导航，继续构建子导航下面的二级导航信息
                    this.buildNavitationTreNode(subNavigationNodes, allNodes);
                }
            })
        }
    }

    // 获取顶级导航目录
    getFirstLevelNodes(): NavigationNode[] {
        let result: NavigationNode[] = [];

        // 提取导航id放入一个数组，获取去重的map中
        let allIds: string[] = [];
        for (const index in this.rawNodes) {
            allIds.push(this.rawNodes[index].id);
        }

        // 遍历原始导航节点（平铺节点list），如果pid不在上面的ids中， 认为顶级目录。
        let firstLevelIds: string[] = [];
        for (const index in this.rawNodes) {
            const rawNode = this.rawNodes[index];
            if (allIds.includes(rawNode.pid)) {
                continue;
            }
            if (firstLevelIds.includes(rawNode.pid)) {
                continue;
            }
            //result.push(new NavigationNode({ id: rawNode.pid }));
            firstLevelIds.push(rawNode.pid);
        }

        // result存储最顶级的节点(男子|女子)
        firstLevelIds.forEach(id => {
            let topNode = this.getParentNodeWithId(id);
            if (!result.includes(topNode)) {
                topNode.navigations = this.getSecondNodes(topNode.id);
                result.push(topNode);
            }
        });

        return result;
    }

    getSecondNodes(pid: string) {
        let result: NavigationNode[] = [];
        for (const index in this.dbNodes) {
            const node = this.dbNodes[index];
            if (node.pid === pid) {
                result.push(new NavigationNode({ id: node.id, pid: node.pid, name: node.name }));
            }
        }
        return result;
    }

    // 根据节点获取一二级导航节点树（直接从数据库获取）
    getParentNodeWithId(id: string): NavigationNode {
        for (const index in this.dbNodes) {
            const node = this.dbNodes[index];
            if (node.id === id) {
                // return node;
                if (!node.pid)
                    return node;
                else {
                    let t = this.getParentNodeWithId(node.pid);
                    return t;
                }
            }
        }
    }



}
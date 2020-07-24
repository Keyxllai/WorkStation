export class NavigationNode{
    id: string;
    pid: string;
    name: string;
    navigations: NavigationNode[];

    constructor(ops: any){
        this.id = ops.id;
        this.pid = ops.pid;
        this.name = ops.name;
        this.navigations = [];
    }
}

// export class NavigationTreeNode{
//     id: string;
//     pid: string;
//     name: string;
//     subNavigationNode: NavigationTreeNode;

//     constructor(ops: any){
//         this.id = ops.id;
//         this.pid = ops.pid;
//         this.name = ops.name;
//     }

//     specifySubNode(node: NavigationTreeNode){
//         this.subNavigationNode = node;
//     }
// }

// export class ResponseResult{
//     id: string;
//     navitationNodeList: NavigationTreeNode[];

//     constructor(id: string){
//         this.id = id;
//     }

//     assignNavigationTreeNodes(navitationNodeList:NavigationTreeNode[]){
//         this.navitationNodeList = navitationNodeList;
//     }
// }
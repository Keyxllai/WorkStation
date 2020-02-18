import { WorkStation } from './../workstation/WorkStation'


export interface IService {
    // name:string;
    workstation: WorkStation;
    init(): any;
    config(): any;
    start(): any;
    stop(): any;
}
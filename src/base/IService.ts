import { WorkStation } from './../workstation/WorkStation'


export interface IService {
    //key:string;
    isWorkStationService: boolean;
    workStation: WorkStation;
    
    init(): any;
    config(): any;
    start(): any;
    stop(): any;
}
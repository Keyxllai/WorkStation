export class Drive {
    id!: string;
    name!: string;
    type!: string;   // local or cloud
    url?: string;    // cloud specify url
    workspaces?: WorkSpace[];
}

export class WorkSpace {
    id!: string;
    name!: string;
    driveId?: string;
    driveName?: string;
    author?: string;
    path!: string;
    folders?: WorkSpaceFolder[];
    totalSize?: string;
    usedSize?: string;
}

export class WorkSpaceFolder {
    id!: string;
    folderName!: string;
    path!: string;
    virtualPath!: string;
    subFolders?: WorkSpaceFolder[];
}

export class WorkSpaceFile {
    id!: string;
    name!: string;
}
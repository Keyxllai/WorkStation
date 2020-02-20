import { Drive } from "./Models";

export class Config {
    id!: string;
    name!: string;
    description!: string;
    items: any;

    constructor() {
        this.id = '';
        this.name = '';
        this.description = '';
    }
}

export class FileSystemConfig extends Config {
    drivers?: Drive[]
    constructor() {
        super();
        this.id = 'FileSystem';
        this.name = 'FileSystem';
        this.description = 'default config';
        this.drivers = [];
    }

    static defaultFileSystemConfig(): FileSystemConfig {
        let config = new FileSystemConfig();

        return config;
    }
}

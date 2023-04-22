export declare class ControlModule {
    static create(crtArg: any): Promise<any>;
    static createApiRoot(): any;
    static createRootPath(pluralName: string): any;
    static createModalPath(pluralName: string): any;
    static createFile(tempPath: string, destPath: string, data: any): any;
    static capitalize: (s: string) => string;
    static importModule(className: string, pluralName: string, singularName: string): void;
    static rmvImportModule(className: string, pluralName: string, singularName: string): void;
    static delete(api: string): void;
}

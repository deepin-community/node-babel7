export declare class ConventionInvalidatePlugin {
    getInvalidationList: OnChangedTransformer;
    constructor(getInvalidationList?: OnChangedTransformer);
    apply(compiler: any): void;
}
export declare class TransformWatchFileSystem {
    wfs: any;
    compiler: any;
    getInvalidationList: OnChangedTransformer;
    constructor(wfs: any, compiler: any, getInvalidationList: OnChangedTransformer);
    readonly inputFileSystem: any;
    readonly watcherOptions: any;
    readonly watcher: any;
    watch(files: any, dirs: any, missing: any, startTime: any, options: any, callback: Function, callbackUndelayed: Function): void;
}
/**
 * "touch", or invalidate all files of the same same path, but different extension
 */
export declare const differentExtensionTransformer: OnChangedTransformer;
export declare type OnChangedTransformer = (changed: Array<string>, watchedFiles?: Array<string>, compiler?: any) => Array<any>;
export interface Timestamps {
    [path: string]: number;
}
export interface WatchResult {
    filesModified: Array<string>;
    dirsModified: Array<string>;
    missingModified: Array<string>;
    fileTimestamps: Timestamps;
    dirTimestamps: Timestamps;
}

/**
 * Webpack Resolve plugin, used to check in additional places for the root directory of a given module
 */
export declare class RewriteModuleSubdirectoryPlugin {
    getIndexPath: (moduleName: string, remainingRequest: string, request: any) => string;
    constructor(getIndexPath: (moduleName: string, remainingRequest: string, request: any) => string);
    apply(resolver: any): void;
}

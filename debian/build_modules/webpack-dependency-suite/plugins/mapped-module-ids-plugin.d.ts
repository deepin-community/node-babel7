export declare type Prefix = string | false | ((moduleId: string) => string);
export declare type LoaderInfo = {
    loader: string;
    prefix: Prefix;
};
export declare type DuplicateHandler = (proposedModuleId: string, module: Webpack.Core.NormalModule, modules: Webpack.Core.NormalModule[], previouslyAssigned: Map<string, Webpack.Core.NormalModule>, retryCount: number) => string;
/**
 * Small description of how this plugin creates moduleIds:
  *  uses module.rawRequest if it doesn't start with '.' or '!' and isn't path.isAbsolute
  *  otherwise makes module ID relative to appDir
  *  if necessary (see after rawRequest impl.):
  *  cuts out '...../node_modules', in case it's nested, cut that nesting too
  *  if the another module of the SAME name already exists, sends a WARNING
  *  checks module.loaders[x].loader (that's a path) for loaders that need prefixing
  *  then name looks e.g. like: 'async!whatever/lalala'
  *  compares pure path with rawRequest and optionally LOGs if different
  *
  *  to use in a dynamic loader test: if ('async!my-thing' in __webpack_require__.m)
  *  then based on existence: handle e.g. __webpack_require__('async!my-thing')
  *
  *  run optional path convertion methods (moduleId) => string
  *  e.g. to strip .../dist/native-modules/...
  */
export declare class MappedModuleIdsPlugin {
    options: {
        appDir: string;
        prefixLoaders: Array<LoaderInfo>;
        dotSlashWhenRelativeToAppDir?: boolean;
        beforeLoadersTransform?: (currentModuleId: string, module?: Webpack.Core.NormalModule) => string;
        afterLoadersTransform?: (currentModuleId: string, module?: Webpack.Core.NormalModule) => string;
        afterExtensionTrimmingTransform?: (currentModuleId: string, module?: Webpack.Core.NormalModule) => string;
        keepAllExtensions?: boolean;
        logWhenRawRequestDiffers?: boolean;
        warnOnNestedSubmodules?: boolean;
        /**
         * RegExp or function, return true if you want to ignore the module
         */
        ignore?: RegExp | ((module: Webpack.Core.NormalModule) => boolean);
        duplicateHandler?: DuplicateHandler;
        errorOnDuplicates?: boolean;
        useManualResolve?: boolean | 'node-fs';
    };
    constructor(options: {
        appDir: string;
        prefixLoaders: Array<LoaderInfo>;
        dotSlashWhenRelativeToAppDir?: boolean;
        beforeLoadersTransform?: (currentModuleId: string, module?: Webpack.Core.NormalModule) => string;
        afterLoadersTransform?: (currentModuleId: string, module?: Webpack.Core.NormalModule) => string;
        afterExtensionTrimmingTransform?: (currentModuleId: string, module?: Webpack.Core.NormalModule) => string;
        keepAllExtensions?: boolean;
        logWhenRawRequestDiffers?: boolean;
        warnOnNestedSubmodules?: boolean;
        /**
         * RegExp or function, return true if you want to ignore the module
         */
        ignore?: RegExp | ((module: Webpack.Core.NormalModule) => boolean);
        duplicateHandler?: DuplicateHandler;
        errorOnDuplicates?: boolean;
        useManualResolve?: boolean | 'node-fs';
    });
    ignoreMethod: ((module: Webpack.Core.NormalModule) => boolean) | undefined;
    apply(compiler: any): void;
}

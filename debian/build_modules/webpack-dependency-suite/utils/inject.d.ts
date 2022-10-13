/// <reference types="source-map" />
import { AddLoadersMethod, RequireData, RequireDataBase } from '../typings/definitions';
import * as SourceMap from 'source-map';
import ModuleDependency = require('webpack/lib/dependencies/ModuleDependency');
export declare function appendCodeAndCallback(loader: Webpack.Core.LoaderContext, source: string, inject: string, sourceMap?: SourceMap.RawSourceMap, synchronousIfPossible?: boolean): string | undefined;
export declare function splitRequest(literal: string, loaderInstance?: Webpack.Core.LoaderContext): Promise<{
    moduleName: string;
    moduleRoot: string;
    remainingRequest: string;
    pathBits: string[];
    remainingRequestBits: string[];
}>;
export declare function expandGlobBase(literal: string, loaderInstance: Webpack.Core.LoaderContext, rootForRelativeResolving?: string | false): Promise<string[]>;
export declare function expandAllRequiresForGlob<T extends {
    literal: string;
}>(requires: Array<T>, loaderInstance: Webpack.Core.LoaderContext, rootForRelativeResolving?: string | false, returnRelativeLiteral?: boolean): Promise<T[]>;
export declare function getRequireStrings(maybeResolvedRequires: Array<RequireData | {
    literal: string;
    resolve?: undefined;
}>, addLoadersMethod: AddLoadersMethod | undefined, loaderInstance: Webpack.Core.LoaderContext, forceFallbackLoaders?: boolean): Promise<Array<string>>;
export declare function wrapInRequireInclude(toRequire: string): string;
export declare function resolveLiteral<T extends {
    literal: string;
}>(toRequire: T, loaderInstance: Webpack.Core.LoaderContext, contextPath?: string, sendWarning?: boolean): Promise<{
    resolve: EnhancedResolve.ResolveResult | undefined;
} & T>;
export declare function addBundleLoader<T extends RequireDataBase>(resources: Array<T>, property?: string): (T & {
    loaders?: string[] | undefined;
    fallbackLoaders?: string[] | undefined;
})[];
export declare class SimpleDependencyClass extends ModuleDependency {
    module: Webpack.Core.NormalModule;
    type: string;
    constructor(request: string);
}
export declare class SimpleDependencyTemplate {
    apply(parentDependency: SimpleDependencyClass, source: Webpack.WebpackSources.ReplaceSource, outputOptions: {
        pathinfo;
    }, requestShortener: {
        shorten: (request: string) => string;
    }): void;
}
export declare const SimpleDependency: typeof SimpleDependencyClass & {
    Template: typeof SimpleDependencyTemplate;
};

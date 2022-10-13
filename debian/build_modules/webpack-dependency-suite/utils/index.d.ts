/// <reference types="lodash" />
/// <reference types="node" />
import * as fs from 'fs';
import { MapCache } from 'lodash';
import { RequireDataBase, SelectorAndAttribute } from '../typings/definitions';
export declare function cacheInvalidationDebounce(cacheKey: string, cache: MapCache, dictionaryKey: any, debounceMs?: number): void;
export declare const getFilesInDir: ((directory: string, {skipHidden, recursive, regexFilter, emitWarning, emitError, fileSystem, regexIgnore, returnRelativeTo, ignoreIfNotExists}?: GetFilesInDirOptions) => Promise<{
    filePath: string;
    stat: fs.Stats;
    relativePath: string;
}[]>) & _.MemoizedFunction;
export interface GetFilesInDirOptions {
    skipHidden?: boolean;
    recursive?: boolean;
    regexFilter?: RegExp;
    emitWarning?: (warn: string) => void;
    emitError?: (warn: string) => void;
    fileSystem?: {
        readdir: Function;
        stat: Function;
    };
    regexIgnore?: Array<RegExp>;
    /**
     * If set to a path, additionally returns the part of the path
     * starting from the directory base without the leading './'
     */
    returnRelativeTo?: string;
    ignoreIfNotExists?: boolean;
}
export declare function getFilesInDirBase(directory: string, {skipHidden, recursive, regexFilter, emitWarning, emitError, fileSystem, regexIgnore, returnRelativeTo, ignoreIfNotExists}?: GetFilesInDirOptions): Promise<Array<{
    filePath: string;
    stat: fs.Stats;
    relativePath: string;
}>>;
export declare function concatPromiseResults<T>(values: Array<PromiseLike<Array<T>>>): Promise<Array<T>>;
export interface ResourcesInput {
    path: Array<string> | string;
    lazy?: boolean;
    bundle?: string;
    chunk?: string;
}
export declare function getResourcesFromList(json: Object, propertyPath: string): RequireDataBase[];
/**
 * Generates list of dependencies based on the passed in selectors, e.g.:
 * - <require from="paths">
 * - <template view-model="./file"></template>
 * - <template view="file.html"></template>
 */
export declare function getTemplateResourcesData(html: string, selectorsAndAttributes: Array<SelectorAndAttribute>, globRegex: RegExp | undefined): RequireDataBase[];

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var cheerio = require("cheerio");
var lodash_1 = require("lodash");
var lodash_2 = require("lodash");
var debug = require("debug");
var log = debug('utils');
var invalidationDebounceDirectory = new WeakMap();
function cacheInvalidationDebounce(cacheKey, cache, dictionaryKey, debounceMs) {
    if (debounceMs === void 0) { debounceMs = 10000; }
    var invalidationDebounce = invalidationDebounceDirectory.get(dictionaryKey);
    if (!invalidationDebounce) {
        invalidationDebounce = new Map();
        invalidationDebounceDirectory.set(dictionaryKey, invalidationDebounce);
    }
    var previousTimeout = invalidationDebounce.get(cacheKey);
    invalidationDebounce.delete(cacheKey);
    if (previousTimeout)
        clearTimeout(previousTimeout);
    var timeout = setTimeout(function () { return cache.delete(cacheKey); }, debounceMs);
    timeout.unref(); // do not require the Node.js event loop to remain active
    invalidationDebounce.set(cacheKey, timeout);
}
exports.cacheInvalidationDebounce = cacheInvalidationDebounce;
exports.getFilesInDir = lodash_1.memoize(getFilesInDirBase, function (directory, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.skipHidden, skipHidden = _c === void 0 ? true : _c, _d = _b.recursive, recursive = _d === void 0 ? false : _d, _e = _b.regexFilter, regexFilter = _e === void 0 ? undefined : _e, _f = _b.emitWarning, emitWarning = _f === void 0 ? console.warn.bind(console) : _f, _g = _b.emitError, emitError = _g === void 0 ? console.error.bind(console) : _g, _h = _b.fileSystem, fileSystem = _h === void 0 ? fs : _h, _j = _b.regexIgnore, regexIgnore = _j === void 0 ? [/node_modules/] : _j, _k = _b.returnRelativeTo, returnRelativeTo = _k === void 0 ? directory : _k;
    /** valid for 10 seconds before invalidating cache **/
    var cacheKey = directory + "::" + skipHidden + "::" + recursive + "::" + regexFilter + "::" + regexIgnore.join('::');
    cacheInvalidationDebounce(cacheKey, exports.getFilesInDir.cache, fileSystem);
    return cacheKey;
});
function getFilesInDirBase(directory, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.skipHidden, skipHidden = _c === void 0 ? true : _c, _d = _b.recursive, recursive = _d === void 0 ? false : _d, _e = _b.regexFilter, regexFilter = _e === void 0 ? undefined : _e, _f = _b.emitWarning, emitWarning = _f === void 0 ? console.warn.bind(console) : _f, _g = _b.emitError, emitError = _g === void 0 ? console.error.bind(console) : _g, _h = _b.fileSystem, fileSystem = _h === void 0 ? fs : _h, _j = _b.regexIgnore, regexIgnore = _j === void 0 ? [/node_modules/] : _j, _k = _b.returnRelativeTo, returnRelativeTo = _k === void 0 ? directory : _k, _l = _b.ignoreIfNotExists, ignoreIfNotExists = _l === void 0 ? false : _l;
    return __awaiter(this, void 0, void 0, function () {
        var exists, files, stats, subDirectoryStats, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!directory) {
                        emitError("No directory supplied");
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            return fileSystem.stat(directory, function (err, stat) {
                                return err ? resolve() :
                                    resolve(stat);
                            });
                        })];
                case 1:
                    exists = _b.sent();
                    if (!exists || !exists.isDirectory()) {
                        if (!ignoreIfNotExists) {
                            emitError("The supplied directory does not exist " + directory);
                        }
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            return fileSystem.readdir(directory, function (err, value) { return err ? resolve([]) || emitWarning("Error when trying to load " + directory + ": " + err.message) : resolve(value); });
                        })];
                case 2:
                    files = _b.sent();
                    if (regexIgnore && regexIgnore.length) {
                        files = files
                            .filter(function (filePath) { return !regexIgnore.some(function (regex) { return regex.test(filePath); }); });
                    }
                    if (skipHidden) {
                        files = files
                            .filter(function (filePath) { return path.basename(filePath)[0] !== '.'; });
                    }
                    files = files.map(function (filePath) { return path.join(directory, filePath); });
                    return [4 /*yield*/, Promise.all(files
                            .map(function (filePath) { return new Promise(function (resolve, reject) {
                            return fileSystem.stat(filePath, function (err, stat) {
                                return err ? resolve({ filePath: filePath, stat: stat, relativePath: '' }) :
                                    resolve({ filePath: filePath, stat: stat, relativePath: path.relative(returnRelativeTo, filePath) });
                            });
                        }); }))];
                case 3:
                    stats = (_b.sent()).filter(function (stat) { return !!stat.stat; });
                    if (regexFilter) {
                        stats = stats
                            .filter(function (file) {
                            return !(file.stat.isFile() && !file.filePath.match(regexFilter));
                        });
                    }
                    if (!recursive)
                        return [2 /*return*/, stats.filter(function (file) { return file.stat.isFile(); })];
                    return [4 /*yield*/, Promise.all(stats.filter(function (file) { return file.stat.isDirectory(); }).map(function (file) { return exports.getFilesInDir(file.filePath, {
                            skipHidden: skipHidden, recursive: recursive, regexFilter: regexFilter, emitWarning: emitWarning, emitError: emitError, fileSystem: fileSystem, regexIgnore: regexIgnore, returnRelativeTo: returnRelativeTo
                        }); }))];
                case 4:
                    subDirectoryStats = _b.sent();
                    return [2 /*return*/, (_a = stats.filter(function (file) { return file.stat.isFile(); })).concat.apply(_a, subDirectoryStats)];
            }
        });
    });
}
exports.getFilesInDirBase = getFilesInDirBase;
// export async function concatPromiseResults<T>(values: (Array<T> | PromiseLike<Array<T>>)[]): Promise<T[]> {
function concatPromiseResults(values) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _b = (_a = (_d = []).concat).apply;
                    _c = [_d];
                    return [4 /*yield*/, Promise.all(values)];
                case 1: return [2 /*return*/, _b.apply(_a, _c.concat([(_e.sent())]))];
            }
        });
    });
}
exports.concatPromiseResults = concatPromiseResults;
function getResourcesFromList(json, propertyPath) {
    var resources = lodash_2.get(json, propertyPath, []);
    if (!resources.length)
        return [];
    var allResources = [];
    resources.forEach(function (input) {
        var r = input instanceof Object && !Array.isArray(input) ? input : { path: input };
        var paths = Array.isArray(r.path) ? r.path : [r.path];
        paths.forEach(function (literal) { return allResources.push({ literal: literal, lazy: r.lazy || false, chunk: r.bundle || r.chunk }); });
    });
    return allResources;
}
exports.getResourcesFromList = getResourcesFromList;
/**
 * Generates list of dependencies based on the passed in selectors, e.g.:
 * - <require from="paths">
 * - <template view-model="./file"></template>
 * - <template view="file.html"></template>
 */
function getTemplateResourcesData(html, selectorsAndAttributes, globRegex) {
    var $ = cheerio.load(html); // { decodeEntities: false }
    function extractRequire(context, fromAttribute) {
        if (fromAttribute === void 0) { fromAttribute = 'from'; }
        var resources = [];
        context.each(function (index) {
            var path = context[index].attribs[fromAttribute];
            if (!path)
                return;
            if (globRegex && globRegex.test(path)) {
                path = path.replace(globRegex, "*");
            }
            var lazy = context[index].attribs.hasOwnProperty('lazy');
            var chunk = context[index].attribs['bundle'] || context[index].attribs['chunk'];
            resources.push({ literal: path, lazy: lazy, chunk: chunk });
        });
        return resources;
    }
    var resourcesArray = selectorsAndAttributes
        .map(function (saa) { return extractRequire($(saa.selector), saa.attribute); });
    var resources = (_a = []).concat.apply(_a, resourcesArray);
    return resources;
    var _a;
}
exports.getTemplateResourcesData = getTemplateResourcesData;
//# sourceMappingURL=index.js.map
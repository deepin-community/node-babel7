"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var loaderUtils = require("loader-utils");
var SourceMap = require("source-map");
var index_1 = require("./index");
var ModuleDependency = require("webpack/lib/dependencies/ModuleDependency");
var escapeStringForRegex = require("escape-string-regexp");
var lodash_1 = require("lodash");
var debug = require("debug");
var log = debug('utils');
function appendCodeAndCallback(loader, source, inject, sourceMap, synchronousIfPossible) {
    if (synchronousIfPossible === void 0) { synchronousIfPossible = false; }
    inject += (!source.trim().endsWith(';')) ? ';\n' : '\n';
    // support existing SourceMap
    // https://github.com/mozilla/source-map#sourcenode
    // https://github.com/webpack/imports-loader/blob/master/index.js#L34-L44
    // https://webpack.github.io/docs/loaders.html#writing-a-loader
    if (sourceMap) {
        var currentRequest = loaderUtils.getCurrentRequest(loader);
        var SourceNode = SourceMap.SourceNode;
        var SourceMapConsumer = SourceMap.SourceMapConsumer;
        var sourceMapConsumer = new SourceMapConsumer(sourceMap);
        var node = SourceNode.fromStringWithSourceMap(source, sourceMapConsumer);
        node.add(inject);
        var result = node.toStringWithSourceMap({
            file: currentRequest
        });
        loader.callback(null, result.code, result.map.toJSON());
    }
    else {
        if (synchronousIfPossible) {
            return inject ? source + inject : source;
        }
        else {
            loader.callback(null, source + inject);
        }
    }
}
exports.appendCodeAndCallback = appendCodeAndCallback;
function splitRequest(literal, loaderInstance) {
    return __awaiter(this, void 0, void 0, function () {
        var pathBits, remainingRequestBits, literalIsRelative, fullPathNdIdx, moduleNameLength, moduleName, ifModuleRemainingRequestBits, remainingRequest, moduleRoot, tryModule;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pathBits = literal.split("/");
                    remainingRequestBits = pathBits.slice();
                    literalIsRelative = literal[0] === '.';
                    if (!!literalIsRelative) return [3 /*break*/, 3];
                    fullPathNdIdx = pathBits.lastIndexOf('node_modules');
                    if (fullPathNdIdx >= 0) {
                        // conform full hard disk path /.../node_modules/MODULE_NAME/... to just MODULE_NAME/...
                        pathBits = pathBits.slice(fullPathNdIdx + 1);
                    }
                    moduleNameLength = pathBits[0].startsWith("@") ? 2 : 1;
                    moduleName = pathBits.slice(0, moduleNameLength).join("/");
                    ifModuleRemainingRequestBits = pathBits.slice(moduleNameLength);
                    remainingRequest = ifModuleRemainingRequestBits.join("/");
                    moduleRoot = '';
                    tryModule = { resolve: undefined };
                    if (!(loaderInstance && !moduleName.includes("*"))) return [3 /*break*/, 2];
                    return [4 /*yield*/, resolveLiteral({ literal: "" + moduleName }, loaderInstance, undefined, false)];
                case 1:
                    // TODO: test this
                    tryModule = _a.sent();
                    if (tryModule.resolve && tryModule.resolve.descriptionFileRoot) {
                        moduleRoot = tryModule.resolve.descriptionFileRoot;
                    }
                    log("does module '" + moduleName + "' exist?: " + (tryModule.resolve && 'true' || 'false'));
                    _a.label = 2;
                case 2:
                    if (!loaderInstance || tryModule.resolve) {
                        return [2 /*return*/, {
                                moduleName: moduleName, moduleRoot: moduleRoot, remainingRequest: remainingRequest, pathBits: pathBits, remainingRequestBits: ifModuleRemainingRequestBits
                            }];
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/, { remainingRequest: literal, remainingRequestBits: remainingRequestBits, pathBits: pathBits, moduleName: '', moduleRoot: '' }];
            }
        });
    });
}
exports.splitRequest = splitRequest;
function expandGlobBase(literal, loaderInstance, rootForRelativeResolving) {
    if (rootForRelativeResolving === void 0) { rootForRelativeResolving = path.dirname(loaderInstance.resourcePath); }
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var _a, pathBits, remainingRequest, remainingRequestBits, moduleName, moduleRoot, possibleRoots, nextGlobAtIndex, relativePathUntilFirstGlob, relativePathFromFirstGlob, possiblePaths, globRegexString, globRegex, correctPaths;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, splitRequest(literal, loaderInstance)];
                case 1:
                    _a = _b.sent(), pathBits = _a.pathBits, remainingRequest = _a.remainingRequest, remainingRequestBits = _a.remainingRequestBits, moduleName = _a.moduleName, moduleRoot = _a.moduleRoot;
                    possibleRoots = loaderInstance.options.resolve.modules.filter(function (m) { return path.isAbsolute(m); });
                    nextGlobAtIndex = remainingRequestBits.findIndex(function (pb) { return pb.includes("*"); });
                    relativePathUntilFirstGlob = remainingRequestBits.slice(0, nextGlobAtIndex).join("/");
                    relativePathFromFirstGlob = remainingRequestBits.slice(nextGlobAtIndex).join("/");
                    if (moduleName && moduleRoot) {
                        // TODO: add support for aliases when they point to a subdirectory
                        // Or maybe the resolve will already include it?
                        possibleRoots = [moduleRoot];
                    }
                    else if (rootForRelativeResolving) {
                        possibleRoots = [rootForRelativeResolving].concat(possibleRoots);
                    }
                    return [4 /*yield*/, index_1.concatPromiseResults(possibleRoots.map(function (directory) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, index_1.getFilesInDir(path.join(directory, relativePathUntilFirstGlob), {
                                            recursive: true, emitWarning: loaderInstance.emitWarning, emitError: loaderInstance.emitError,
                                            fileSystem: loaderInstance.fs, skipHidden: true
                                        })];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); }))];
                case 2:
                    possiblePaths = _b.sent();
                    possiblePaths = lodash_1.uniqBy(possiblePaths, 'filePath');
                    globRegexString = escapeStringForRegex(relativePathFromFirstGlob)
                        .replace(/\//g, '[\\/]+') // accept Windows and Unix slashes
                        .replace(/\\\*\\\*/g, '\.*?') // multi glob ** => any number of subdirectories
                        .replace(/\\\*/g, '[^/\\\\]*?') // single glob * => one directory (stops at first slash/backslash)
                    ;
                    globRegex = new RegExp("^" + globRegexString + "$") // (?:\.\w+)
                    ;
                    correctPaths = possiblePaths.filter(function (p) { return p.stat.isFile() && globRegex.test(p.relativePath); });
                    return [2 /*return*/, correctPaths.map(function (p) { return p.filePath; })];
            }
        });
    });
}
exports.expandGlobBase = expandGlobBase;
var expandGlob = lodash_1.memoize(expandGlobBase, function (literal, loaderInstance, rootForRelativeResolving) {
    if (rootForRelativeResolving === void 0) { rootForRelativeResolving = path.dirname(loaderInstance.resourcePath); }
    /** valid for 10 seconds for the same literal and resoucePath */
    var cacheKey = literal + "::" + path.dirname(loaderInstance.resourcePath) + "::" + rootForRelativeResolving;
    // invalidate every 10 seconds based on each unique Webpack compilation
    index_1.cacheInvalidationDebounce(cacheKey, expandGlob.cache, loaderInstance._compilation);
    return cacheKey;
});
function fixWindowsPath(windowsPath) {
    return windowsPath.replace(/\\/g, '/');
}
function expandAllRequiresForGlob(requires, loaderInstance, rootForRelativeResolving, returnRelativeLiteral) {
    if (rootForRelativeResolving === void 0) { rootForRelativeResolving = path.dirname(loaderInstance.resourcePath); }
    if (returnRelativeLiteral === void 0) { returnRelativeLiteral = false; }
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var needDeglobbing, deglobbed, allDeglobbed, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    needDeglobbing = requires.filter(function (r) { return r.literal.includes("*"); });
                    deglobbed = requires.filter(function (r) { return !r.literal.includes("*"); });
                    _b = (_a = deglobbed).concat;
                    return [4 /*yield*/, index_1.concatPromiseResults(needDeglobbing.map(function (r) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, expandGlob(r.literal, loaderInstance, rootForRelativeResolving)];
                                    case 1: return [2 /*return*/, (_a.sent())
                                            .map(function (correctPath) { return Object.assign({}, r, {
                                            literal: returnRelativeLiteral ?
                                                "./" + fixWindowsPath(path.relative(path.dirname(loaderInstance.resourcePath), correctPath)) : correctPath
                                        }); })];
                                }
                            });
                        }); }))];
                case 1:
                    allDeglobbed = _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/, lodash_1.uniqBy(allDeglobbed, 'literal')];
            }
        });
    });
}
exports.expandAllRequiresForGlob = expandAllRequiresForGlob;
// TODO: function cleanUpPath
// this func does: makes a relative path from absolute
// OR strips all node_modules and makes a 'module' request path instead
// USE IT in the above glob expansion or better yet, in the below getRequireString, so we have nice requests instead of full paths!
function getRequireStrings(maybeResolvedRequires, addLoadersMethod, loaderInstance, forceFallbackLoaders) {
    if (forceFallbackLoaders === void 0) { forceFallbackLoaders = false; }
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var requires, pathsAndLoaders, maybePromise, pathsAndLoadersReturnValue, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all(maybeResolvedRequires.map(function (r) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!!r.resolve) return [3 /*break*/, 2];
                                return [4 /*yield*/, resolveLiteral(r, loaderInstance)];
                            case 1:
                                _a = _b.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                _a = r;
                                _b.label = 3;
                            case 3: return [2 /*return*/, _a];
                        }
                    }); }); }))];
                case 1:
                    requires = (_b.sent()).filter(function (r) { return !!r.resolve; });
                    if (!(typeof addLoadersMethod === 'function')) return [3 /*break*/, 5];
                    maybePromise = addLoadersMethod(requires, loaderInstance);
                    if (!maybePromise.then) return [3 /*break*/, 3];
                    return [4 /*yield*/, maybePromise];
                case 2:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = maybePromise;
                    _b.label = 4;
                case 4:
                    pathsAndLoadersReturnValue = _a;
                    pathsAndLoaders = pathsAndLoadersReturnValue.map(function (p) {
                        var rq = requires.find(function (r) { return r.resolve.path === p.path; });
                        if (!rq)
                            return Object.assign(p, { removed: true, literal: undefined });
                        return Object.assign(p, { loaders: (p.loaders && !forceFallbackLoaders) ? p.loaders : (rq.loaders || rq.fallbackLoaders || []), literal: rq.literal, removed: false });
                    }).filter(function (r) { return !r.removed; });
                    return [3 /*break*/, 6];
                case 5:
                    pathsAndLoaders = requires.map(function (r) { return ({ literal: r.literal, loaders: r.loaders || r.fallbackLoaders || [], path: r.resolve.path }); });
                    _b.label = 6;
                case 6: return [2 /*return*/, pathsAndLoaders.map(function (p) {
                        return (p.loaders && p.loaders.length) ?
                            "!" + p.loaders.join('!') + "!" + p.literal :
                            p.literal;
                    })];
            }
        });
    });
}
exports.getRequireStrings = getRequireStrings;
function wrapInRequireInclude(toRequire) {
    return "require.include('" + toRequire + "');";
}
exports.wrapInRequireInclude = wrapInRequireInclude;
// TODO: memoize:
function resolveLiteral(toRequire, loaderInstance, contextPath /* TODO: could this simply be loaderInstance.context ? */, sendWarning) {
    if (contextPath === void 0) { contextPath = path.dirname(loaderInstance.resourcePath); } /* TODO: could this simply be loaderInstance.context ? */
    if (sendWarning === void 0) { sendWarning = true; }
    debug('resolve')("Resolving: " + toRequire.literal);
    return new Promise(function (resolve, reject) {
        return loaderInstance.resolve(contextPath, toRequire.literal, function (err, result, value) { return err ? resolve(Object.assign({ resolve: value }, toRequire)) || (sendWarning && loaderInstance.emitWarning(err.message)) :
            resolve(Object.assign({ resolve: value }, toRequire)); });
    });
}
exports.resolveLiteral = resolveLiteral;
function addBundleLoader(resources, property) {
    if (property === void 0) { property = 'fallbackLoaders'; }
    return resources.map(function (toRequire) {
        var lazy = toRequire.lazy && 'lazy' || '';
        var chunkName = (toRequire.chunk && "name=" + toRequire.chunk) || '';
        var and = lazy && chunkName && '&' || '';
        var bundleLoaderPrefix = (lazy || chunkName) ? 'bundle?' : '';
        var bundleLoaderQuery = "" + bundleLoaderPrefix + lazy + and + chunkName;
        return bundleLoaderQuery ? Object.assign((_a = {}, _a[property] = [bundleLoaderQuery], _a), toRequire) : toRequire;
        var _a;
    });
}
exports.addBundleLoader = addBundleLoader;
// TODO: use custom ModuleDependency instead of injecting code
var SimpleDependencyClass = (function (_super) {
    __extends(SimpleDependencyClass, _super);
    function SimpleDependencyClass(request) {
        var _this = _super.call(this, request) || this;
        _this.type = 'simple-dependency';
        debugger;
        return _this;
    }
    return SimpleDependencyClass;
}(ModuleDependency));
exports.SimpleDependencyClass = SimpleDependencyClass;
var SimpleDependencyTemplate = (function () {
    function SimpleDependencyTemplate() {
    }
    SimpleDependencyTemplate.prototype.apply = function (parentDependency, source, outputOptions, requestShortener) {
        debugger;
        if (outputOptions.pathinfo && parentDependency.module) {
            var comment = ("/*! simple-dependency " + requestShortener.shorten(parentDependency.request) + " */");
            source.insert(source.size(), comment);
        }
    };
    return SimpleDependencyTemplate;
}());
exports.SimpleDependencyTemplate = SimpleDependencyTemplate;
exports.SimpleDependency = Object.assign(SimpleDependencyClass, { Template: SimpleDependencyTemplate });
//# sourceMappingURL=inject.js.map
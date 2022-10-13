"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var resolve = require("enhanced-resolve");
function resolveLoader(compiler, origin, contextPath, loaderInfo, resolver) {
    return new Promise(function (resolve, reject) {
        return resolver(origin, contextPath, loaderInfo.loader, function (error, resolvedPath, resolveObj) {
            return (error || !resolveObj) ? (resolve(__assign({ error: error }, loaderInfo)) || console.error("No loader resolved for '" + loaderInfo.loader + "'")) :
                resolve(__assign({}, resolveObj, loaderInfo));
        });
    });
}
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
var MappedModuleIdsPlugin = (function () {
    function MappedModuleIdsPlugin(options) {
        this.options = options;
        var ignore = options.ignore;
        if (ignore) {
            this.ignoreMethod = typeof ignore === 'function' ? ignore : function (module) {
                return ignore.test(module.rawRequest);
            };
        }
    }
    MappedModuleIdsPlugin.prototype.apply = function (compiler) {
        var _this = this;
        var options = this.options;
        if (!options.appDir) {
            options.appDir = compiler.options.context;
        }
        var resolvedLoaders = [];
        var fileSystem = options.useManualResolve && options.useManualResolve !== 'node-fs' && compiler.inputFileSystem || require('fs');
        var resolver = options.useManualResolve ? resolve.create(__assign({ fileSystem: fileSystem }, compiler.options.resolveLoader)) : undefined;
        var beforeRunStep = function (compilingOrWatching, callback) { return __awaiter(_this, void 0, void 0, function () {
            var webpackLoaderResolver, resolved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (resolvedLoaders.length) {
                            // cached from previous resolve
                            return [2 /*return*/, callback()];
                        }
                        webpackLoaderResolver = compiler.resolvers.loader.resolve.bind(compiler.resolvers.loader);
                        return [4 /*yield*/, Promise.all(options.prefixLoaders.map(function (loaderName) { return resolveLoader(compiler, {}, compiler.options.context, loaderName, resolver || webpackLoaderResolver); }))];
                    case 1:
                        resolved = _a.sent();
                        resolvedLoaders = resolved.filter(function (r) { return !r.error; });
                        return [2 /*return*/, callback()];
                }
            });
        }); };
        compiler.plugin('run', beforeRunStep);
        compiler.plugin('watch-run', beforeRunStep);
        compiler.plugin('compilation', function (compilation) {
            var previouslyAssigned = new Map();
            compilation.plugin('before-module-ids', function (modules) {
                modules.forEach(function (module) {
                    if (module.userRequest && module.rawRequest && module.id === null && (!_this.ignoreMethod || !_this.ignoreMethod(module))) {
                        var userRequest = module.userRequest || '';
                        var rawRequest_1 = module.rawRequest || '';
                        var requestSep = userRequest.split('!');
                        var loadersUsed = requestSep.length > 1;
                        var userRequestLoaders = requestSep.slice(0, requestSep.length - 1);
                        var userRequestLoaderPaths_1 = userRequestLoaders.map(function (name) {
                            var queryStart = name.indexOf('?');
                            return (queryStart > -1) ? name.substring(0, queryStart) : name;
                        });
                        var requestedFilePath = requestSep[requestSep.length - 1];
                        var moduleId_1 = path.relative(options.appDir, requestedFilePath);
                        if (path.sep === '\\')
                            moduleId_1 = moduleId_1.replace(/\\/g, '/');
                        var lastMentionOfNodeModules = moduleId_1.lastIndexOf('node_modules');
                        if (lastMentionOfNodeModules >= 0) {
                            var firstMentionOfNodeModules = moduleId_1.indexOf('node_modules');
                            if (options.warnOnNestedSubmodules && firstMentionOfNodeModules != lastMentionOfNodeModules) {
                                console.warn("Path is a nested node_modules");
                            }
                            // cut out node_modules
                            moduleId_1 = moduleId_1.slice(lastMentionOfNodeModules + 'node_modules'.length + 1);
                        }
                        else if (options.dotSlashWhenRelativeToAppDir) {
                            moduleId_1 = "./" + moduleId_1;
                        }
                        if (options.beforeLoadersTransform) {
                            moduleId_1 = options.beforeLoadersTransform(moduleId_1, module);
                        }
                        var rawRequestSplit = rawRequest_1.split("!");
                        var rawRequestPath = rawRequestSplit[rawRequestSplit.length - 1];
                        var rawRequestPathParts = rawRequestPath.split("/");
                        if (!path.isAbsolute(rawRequestPath) && !rawRequestPath.startsWith(".") &&
                            (rawRequestPathParts.length === 1 ||
                                (rawRequestPathParts.length === 2 && rawRequestPathParts[0].startsWith("@")))) {
                            // we're guessing that this is a call to the package.json/main field
                            // we want to keep the module name WITHOUT the full path, so lets try naming this with the request
                            moduleId_1 = rawRequestPath;
                        }
                        var loadersAdded_1 = 0;
                        module.loaders.forEach(function (loader) {
                            var resolved = resolvedLoaders.find(function (l) { return l.path === loader.loader; });
                            var wasInUserRequest = userRequestLoaderPaths_1.find(function (loaderPath) { return loaderPath === loader.loader; });
                            if (!resolved || resolved.prefix === '' || resolved.prefix === undefined) {
                                if (wasInUserRequest) {
                                    console.warn("Warning: Keeping '" + rawRequest_1 + "' without the loader prefix '" + loader.loader + "'." + '\n' +
                                        "Explicitly silence these warnings by defining the loader in MappedModuleIdsPlugin configuration");
                                }
                                return;
                            }
                            // actively supress prefixing when false
                            if (resolved.prefix === false)
                                return;
                            if (typeof resolved.prefix === 'function') {
                                moduleId_1 = resolved.prefix(moduleId_1);
                            }
                            else {
                                moduleId_1 = resolved.prefix + "!" + moduleId_1;
                            }
                            loadersAdded_1++;
                        });
                        if (options.afterLoadersTransform) {
                            moduleId_1 = options.afterLoadersTransform(moduleId_1, module);
                        }
                        if (!options.keepAllExtensions) {
                            var trimExtensions = compiler.options.resolve.extensions;
                            trimExtensions.forEach(function (ext) {
                                if (moduleId_1.endsWith(ext)) {
                                    moduleId_1 = moduleId_1.slice(0, moduleId_1.length - ext.length);
                                }
                            });
                        }
                        if (options.afterExtensionTrimmingTransform) {
                            moduleId_1 = options.afterExtensionTrimmingTransform(moduleId_1, module);
                        }
                        var proposedModuleIdSplit = moduleId_1.split("!");
                        var proposedModuleIdPath = proposedModuleIdSplit[proposedModuleIdSplit.length - 1];
                        if (options.logWhenRawRequestDiffers && !rawRequestPath.startsWith(".") && (proposedModuleIdPath !== rawRequestPath)) {
                            console.info("Raw Request Path (" + rawRequestPath + ") differs from the generated ID (" + proposedModuleIdPath + ")");
                        }
                        var retryCount = 0;
                        while (previouslyAssigned.has(moduleId_1)) {
                            var _a = options.duplicateHandler, duplicateHandler = _a === void 0 ? (function (moduleId, module, modules, previouslyAssigned, retryCount) {
                                if (options.errorOnDuplicates) {
                                    console.error("Error: Multiple modules with the same ID: '" + moduleId + "'");
                                }
                                return moduleId + "#" + retryCount;
                            }) : _a;
                            moduleId_1 = duplicateHandler(moduleId_1, module, modules, previouslyAssigned, retryCount);
                            retryCount++;
                        }
                        previouslyAssigned.set(moduleId_1, module);
                        module.id = moduleId_1;
                    }
                });
            });
        });
    };
    return MappedModuleIdsPlugin;
}());
exports.MappedModuleIdsPlugin = MappedModuleIdsPlugin;
//# sourceMappingURL=mapped-module-ids-plugin.js.map
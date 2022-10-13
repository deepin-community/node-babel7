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
var inject_1 = require("../utils/inject");
var loaderUtils = require("loader-utils");
var utils_1 = require("../utils");
var path = require("path");
var debug = require("debug");
var log = debug('list-based-require-loader');
function ListBasedRequireLoader(source, sourceMap) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var query, self_1, resolve_1, listBasedRequireDone, resources, resourceData, isRootRequest_1, resolvedResources, requireStrings, inject, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.async();
                    query = Object.assign({ requireInFirstFileOnly: true, enableGlobbing: false }, loaderUtils.parseQuery(this.query));
                    if (this.cacheable) {
                        this.cacheable();
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, inject_1.resolveLiteral({ literal: this.resourcePath }, this)];
                case 2:
                    self_1 = _a.sent();
                    resolve_1 = self_1.resolve;
                    listBasedRequireDone = this._compilation.listBasedRequireDone || (this._compilation.listBasedRequireDone = new Set());
                    if (!resolve_1 || (query.requireInFirstFileOnly && listBasedRequireDone.has(resolve_1.descriptionFileRoot))) {
                        return [2 /*return*/, this.callback(undefined, source, sourceMap)];
                    }
                    else if (query.requireInFirstFileOnly) {
                        listBasedRequireDone.add(resolve_1.descriptionFileRoot);
                    }
                    resources = resolve_1 ?
                        utils_1.getResourcesFromList(resolve_1.descriptionFileData, query.packagePropertyPath) :
                        [];
                    if (!resources.length) {
                        return [2 /*return*/, this.callback(undefined, source, sourceMap)];
                    }
                    return [4 /*yield*/, inject_1.addBundleLoader(resources, 'loaders')];
                case 3:
                    resourceData = _a.sent();
                    isRootRequest_1 = query.rootDir === resolve_1.descriptionFileRoot;
                    if (!query.enableGlobbing) return [3 /*break*/, 5];
                    return [4 /*yield*/, inject_1.expandAllRequiresForGlob(resourceData, this, isRootRequest_1 ? false : resolve_1.descriptionFileRoot)];
                case 4:
                    resourceData = _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    resourceData = resourceData.filter(function (r) { return !r.literal.includes("*"); });
                    _a.label = 6;
                case 6: return [4 /*yield*/, Promise.all(resourceData.map(function (r) { return __awaiter(_this, void 0, void 0, function () {
                        var resource, packageName, tryContexts, contextDir, tryCount, isSameModuleRequest, literal, relativeLiteral;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    resource = null;
                                    packageName = resolve_1.descriptionFileData && resolve_1.descriptionFileData.name;
                                    tryContexts = [resolve_1.descriptionFileRoot].concat((query.fallbackToMainContext ? [query.rootDir] : []));
                                    tryCount = 0;
                                    isSameModuleRequest = packageName && (r.literal.startsWith(packageName + "/") || r.literal === packageName);
                                    _a.label = 1;
                                case 1:
                                    if (!((!resource || !resource.resolve) && (contextDir = tryContexts.shift()))) return [3 /*break*/, 6];
                                    if (!(!isSameModuleRequest && packageName && !path.isAbsolute(r.literal) && !isRootRequest_1)) return [3 /*break*/, 3];
                                    literal = packageName + "/" + r.literal;
                                    return [4 /*yield*/, inject_1.resolveLiteral(Object.assign({}, r, { literal: literal }), this, contextDir, false)];
                                case 2:
                                    // resolve as MODULE_NAME/REQUEST_PATH
                                    resource = _a.sent();
                                    log("[" + (resource && resource.resolve ? 'SUCCESS' : 'FAIL') + "] [" + ++tryCount + "] '" + literal + "' in '" + contextDir + "'");
                                    _a.label = 3;
                                case 3:
                                    if (!(!resource || !resource.resolve)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, inject_1.resolveLiteral(r, this, contextDir, false)];
                                case 4:
                                    // resolve as REQUEST_PATH
                                    resource = (_a.sent());
                                    log("[" + (resource && resource.resolve ? 'SUCCESS' : 'FAIL') + "] [" + ++tryCount + "] '" + r.literal + "' in '" + contextDir + "'");
                                    _a.label = 5;
                                case 5: return [3 /*break*/, 1];
                                case 6:
                                    if (!resource || !resource.resolve) {
                                        return [2 /*return*/, this.emitWarning("Unable to resolve " + r.literal + " in context of " + packageName)];
                                    }
                                    if (!resource.literal.startsWith('.') && (resource.resolve.descriptionFileData && resource.resolve.descriptionFileData.name) === packageName) {
                                        relativeLiteral = path.relative(path.dirname(resolve_1.path), resource.resolve.path);
                                        if (!relativeLiteral.startsWith('..')) {
                                            relativeLiteral = "./" + relativeLiteral;
                                        }
                                        log("Mapped an internal module-based literal to a relative one: " + resource.literal + " => " + relativeLiteral);
                                        resource.literal = relativeLiteral;
                                    }
                                    return [2 /*return*/, resource];
                            }
                        });
                    }); }))];
                case 7:
                    resolvedResources = (_a.sent()).filter(function (r) { return !!r && r.resolve.path !== _this.resourcePath; });
                    log("Adding resources to " + this.resourcePath + ": " + resolvedResources.map(function (r) { return r.literal; }).join(', '));
                    return [4 /*yield*/, inject_1.getRequireStrings(resolvedResources, query.addLoadersCallback, this)];
                case 8:
                    requireStrings = _a.sent();
                    inject = requireStrings.map(inject_1.wrapInRequireInclude).join('\n');
                    inject_1.appendCodeAndCallback(this, source, inject, sourceMap);
                    return [3 /*break*/, 10];
                case 9:
                    e_1 = _a.sent();
                    log(e_1);
                    this.emitError(e_1.message);
                    this.callback(undefined, source, sourceMap);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.default = ListBasedRequireLoader;
//# sourceMappingURL=list-based-require-loader.js.map
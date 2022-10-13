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
var lodash_1 = require("lodash");
var createInnerCallback = require("enhanced-resolve/lib/createInnerCallback");
var semver = require("semver");
var path = require("path");
var debug = require("debug");
var log = debug('root-most-resolve-plugin');
function getDependencyVersion(packageJson, packageName) {
    return lodash_1.get(packageJson, ['dependencies', packageName]) ||
        lodash_1.get(packageJson, ['devDependencies', packageName]) ||
        lodash_1.get(packageJson, ['optionalDependencies', packageName]) ||
        lodash_1.get(packageJson, ['peerDependencies', packageName]);
}
/**
 * @description Uses the root-most package instead of a nested node_modules package.
 * Useful when doing 'npm link' for nested dependencies,
 * so you can be sure all packages use the right copy of the given module.
 */
var RootMostResolvePlugin = (function () {
    function RootMostResolvePlugin(context, force, overwriteInvalidSemVer) {
        if (overwriteInvalidSemVer === void 0) { overwriteInvalidSemVer = true; }
        this.context = context;
        this.force = force;
        this.overwriteInvalidSemVer = overwriteInvalidSemVer;
    }
    RootMostResolvePlugin.prototype.apply = function (resolver) {
        var context = this.context;
        var force = this.force;
        var overwriteInvalidSemVer = this.overwriteInvalidSemVer;
        resolver.plugin('resolved', function (originalResolved, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var previousPathSep, nodeModulesCount, relativeToContext, lastNodeModulesAt, actualRequestPath, issuer, resolvedInParentContext, resolvedVersion, packageName, allowedRange, isValidRange;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (originalResolved.context['rootMostResolve']) {
                                // do not loop!
                                return [2 /*return*/, callback(null, originalResolved)];
                            }
                            previousPathSep = originalResolved.path.split(path.sep);
                            nodeModulesCount = previousPathSep.filter(function (p) { return p === 'node_modules'; }).length;
                            relativeToContext = path.relative(context, originalResolved.path);
                            if (!force && !relativeToContext.includes("..") && nodeModulesCount <= 1) {
                                return [2 /*return*/, callback(null, originalResolved)];
                            }
                            lastNodeModulesAt = previousPathSep.lastIndexOf('node_modules');
                            actualRequestPath = previousPathSep.slice(lastNodeModulesAt + 1).join('/');
                            if (!originalResolved.context || !originalResolved.context.issuer) {
                                return [2 /*return*/, callback(null, originalResolved)];
                            }
                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                    return resolver.doResolve('resolve', { context: { rootMostResolve: true }, path: originalResolved.context.issuer, request: originalResolved.context.issuer }, "resolve issuer of " + originalResolved.path, function (err, value) { return err ? resolve() : resolve(value); });
                                })];
                        case 1:
                            issuer = _a.sent();
                            if (!issuer) {
                                return [2 /*return*/, callback(null, originalResolved)];
                            }
                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                    return resolver.doResolve('resolve', {
                                        context: {},
                                        path: context,
                                        request: actualRequestPath
                                    }, "resolve " + actualRequestPath + " in " + context, createInnerCallback(function (err, value) { return err ? resolve() : resolve(value); }, callback, null));
                                })];
                        case 2:
                            resolvedInParentContext = _a.sent();
                            if (!resolvedInParentContext) {
                                return [2 /*return*/, callback(null, originalResolved)];
                            }
                            resolvedVersion = resolvedInParentContext.descriptionFileData && resolvedInParentContext.descriptionFileData.version;
                            packageName = resolvedInParentContext.descriptionFileData && resolvedInParentContext.descriptionFileData.name;
                            allowedRange = getDependencyVersion(issuer.descriptionFileData, packageName);
                            isValidRange = allowedRange && semver.validRange(allowedRange);
                            log("Analyzing whether package " + packageName + "@" + allowedRange + " can be substituted by a parent version " + resolvedVersion);
                            if (!isValidRange)
                                log("Package " + packageName + " has an invalid SemVer range, " + (overwriteInvalidSemVer ? 'overwriting anyway' : 'not overwriting'));
                            if (resolvedVersion && packageName && allowedRange && ((!isValidRange && overwriteInvalidSemVer) || semver.satisfies(resolvedVersion, allowedRange, true))) {
                                log("Rewriting " + relativeToContext + " with " + actualRequestPath);
                                return [2 /*return*/, callback(null, resolvedInParentContext)];
                            }
                            else {
                                return [2 /*return*/, callback(null, originalResolved)];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        });
    };
    return RootMostResolvePlugin;
}());
exports.RootMostResolvePlugin = RootMostResolvePlugin;
//# sourceMappingURL=root-most-resolve-plugin.js.map
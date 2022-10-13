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
var utils_1 = require("../utils");
var inject_1 = require("../utils/inject");
var path = require("path");
var debug = require("debug");
var log = debug('aurelia');
/**
 * 1. load MAIN package.json
 * 2. get the aurelia resources: packageJson.aurelia && packageJson.aurelia.build && packageJson.aurelia.build.resources
 * 3. glob all resources
 * 4. resolve each resource in the context of MAIN package.json
 * 5. foreach files, match with resolved resources and replace loaders or return what was there
 *
 * @param {Object} packageJson
 * @param {string} rootDir
 * @param {Array<RequireData>} files
 * @param {Webpack.Core.LoaderContext} loaderInstance
 * @returns {Promise<Array<PathWithLoaders>>}
 */
function addLoadersMethod(rootDir, files, loaderInstance) {
    return __awaiter(this, void 0, void 0, function () {
        var resolvedResources, packageJsonPath, packageJson, resources, resourceData, globbedResources, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    resolvedResources = loaderInstance._compilation._aureliaResolvedResources;
                    if (!!resolvedResources) return [3 /*break*/, 4];
                    packageJsonPath = path.join(rootDir, 'package.json');
                    packageJson = require(packageJsonPath);
                    resources = utils_1.getResourcesFromList(packageJson, 'aurelia.build.resources');
                    return [4 /*yield*/, inject_1.addBundleLoader(resources, 'loaders')];
                case 1:
                    resourceData = _b.sent();
                    return [4 /*yield*/, inject_1.expandAllRequiresForGlob(resourceData, loaderInstance, false)];
                case 2:
                    globbedResources = _b.sent();
                    _a = loaderInstance._compilation;
                    return [4 /*yield*/, utils_1.concatPromiseResults(globbedResources.map(function (r) { return inject_1.resolveLiteral(r, loaderInstance, rootDir); } /* TODO: typings */))];
                case 3:
                    _a._aureliaResolvedResources = resolvedResources = (_b.sent()).filter(function (rr) { return !!rr.resolve; });
                    _b.label = 4;
                case 4: 
                // resolvedResources.forEach(rr => log(rr.resolve.path))
                // const hmm = files.filter(f => f.resolve.path.includes(`aurelia-templating-resources`)).map(f => f.resolve.path)
                // if (hmm.length) {
                //   log(hmm.find(f => !!resolvedResources.find(rr => rr.resolve.path === f)))
                //   const fss = resolvedResources.find(rr => rr.resolve.path === hmm.find(f => f.includes(`signal-binding`)))
                //   if (fss) log(fss)
                // }
                return [2 /*return*/, files
                        .map(function (f) {
                        var resolvedFile = resolvedResources.find(function (rr) { return rr.resolve.path === f.resolve.path; });
                        return { path: f.resolve.path, loaders: (resolvedFile && resolvedFile.loaders) || undefined };
                        // return (resolvedFile && resolvedFile.loaders) ? (Object.assign(f, { loaders: resolvedFile.loaders })) : f
                    })
                    // return enforcedLoadersFiles.map(f => ({
                    //   path: f.resolve.path,
                    //   loaders: f.loaders
                    // }))
                ];
            }
        });
    });
}
exports.addLoadersMethod = addLoadersMethod;
//# sourceMappingURL=aurelia.js.map
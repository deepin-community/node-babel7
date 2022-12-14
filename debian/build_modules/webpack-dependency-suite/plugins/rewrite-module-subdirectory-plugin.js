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
var path = require("path");
var debug = require("debug");
var log = debug('rewrite-subdir-plugin');
/**
 * Webpack Resolve plugin, used to check in additional places for the root directory of a given module
 */
var RewriteModuleSubdirectoryPlugin = (function () {
    function RewriteModuleSubdirectoryPlugin(getIndexPath) {
        this.getIndexPath = getIndexPath;
    }
    RewriteModuleSubdirectoryPlugin.prototype.apply = function (resolver) {
        var _this = this;
        var getIndexPath = this.getIndexPath;
        resolver.plugin('raw-module', function (request, callback) { return __awaiter(_this, void 0, void 0, function () {
            var _a, moduleName, remainingRequest, newRequest, obj;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (path.isAbsolute(request.request))
                            return [2 /*return*/, callback()];
                        return [4 /*yield*/, inject_1.splitRequest(request.request)];
                    case 1:
                        _a = _b.sent(), moduleName = _a.moduleName, remainingRequest = _a.remainingRequest;
                        if (!moduleName)
                            return [2 /*return*/, callback()];
                        newRequest = getIndexPath(moduleName, remainingRequest, request);
                        if (!newRequest)
                            return [2 /*return*/, callback()];
                        log(request.request + " => " + newRequest);
                        obj = Object.assign({}, request, {
                            request: newRequest
                        });
                        resolver.doResolve('module', obj, "looking for modules in " + newRequest, callback, true);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return RewriteModuleSubdirectoryPlugin;
}());
exports.RewriteModuleSubdirectoryPlugin = RewriteModuleSubdirectoryPlugin;
// class DynamicMainPlugin {
//   constructor(public getIndexPath: (request) => string) {}
//   apply(resolver) {
//     const getIndexPath = this.getIndexPath
//     // "existing-directory", item, "resolve"
//     resolver.plugin("existing-directory", (request, callback) => {
// 		  // if (request.path !== request.descriptionFileRoot) return callback();
//       const filename = getIndexPath(request)
//       if (!filename) return callback()
//       const fs = resolver.fileSystem;
//       const topLevelCallback = callback;
//       const filePath = resolver.join(request.path, filename);
//       const obj = Object.assign({}, request, {
//           path: filePath,
//           relativePath: request.relativePath && resolver.join(request.relativePath, filename)
//       });
//       resolver.doResolve("undescribed-raw-file", obj, `using path: ${filePath}`, callback);
//     });
//   }
// }
// export = DynamicMainPlugin
//# sourceMappingURL=rewrite-module-subdirectory-plugin.js.map
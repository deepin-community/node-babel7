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
var loaderUtils = require("loader-utils");
var inject_1 = require("../utils/inject");
var utils_1 = require("../utils");
var debug = require("debug");
var log = debug('convention-loader');
exports.conventions = {
    'extension-swap': function (fullPath, query) {
        var basename = path.basename(fullPath);
        var noExtension = basename.substr(0, basename.lastIndexOf('.')) || basename;
        var extensions;
        if (Array.isArray(query.extension)) {
            extensions = query.extension;
        }
        else {
            extensions = query.extension ? [query.extension] : ['.html', '.css'];
        }
        var basepath = path.dirname(fullPath);
        return extensions.map(function (extension) { return path.join(basepath, noExtension + extension); });
    },
    'all-files-matching-regex': function (fullPath, query, loaderInstance) {
        return __awaiter(this, void 0, void 0, function () {
            var files;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_1.getFilesInDir(query.directory, {
                            regexFilter: query.regex,
                            emitWarning: loaderInstance.emitWarning.bind(loaderInstance),
                            emitError: loaderInstance.emitError.bind(loaderInstance),
                            fileSystem: loaderInstance.fs,
                            recursive: true
                        })];
                    case 1:
                        files = _a.sent();
                        return [2 /*return*/, files
                                .filter(function (file) { return file.filePath !== loaderInstance.resourcePath; })
                                .map(function (file) { return file.filePath; })];
                }
            });
        });
    },
};
function ConventionLoader(source, sourceMap) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var query, requires, maybeAddResource, actOnConvention, resourceDir_1, relativeRequires, requireStrings, inject, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.async();
                    query = Object.assign({}, loaderUtils.parseQuery(this.query));
                    if (this.cacheable) {
                        this.cacheable();
                    }
                    if (!query || !query.convention) {
                        this.emitError("No convention defined, passing through: " + this.currentRequest + " / " + this.request);
                        this.callback(undefined, source, sourceMap);
                        return [2 /*return*/];
                    }
                    requires = [];
                    maybeAddResource = function (input) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        var value, _a, fullPaths;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!input)
                                        return [2 /*return*/];
                                    if (!input.then) return [3 /*break*/, 2];
                                    return [4 /*yield*/, input];
                                case 1:
                                    _a = _b.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    _a = input;
                                    _b.label = 3;
                                case 3:
                                    value = _a;
                                    fullPaths = typeof value === 'string' ? [value] : value;
                                    return [4 /*yield*/, Promise.all(fullPaths.map(function (fullPath) { return __awaiter(_this, void 0, void 0, function () {
                                            var _this = this;
                                            var stat;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                                                            return _this.fs.stat(fullPath, function (err, value) { return resolve(value); });
                                                        })];
                                                    case 1:
                                                        stat = _a.sent();
                                                        if (stat) {
                                                            requires.push(fullPath);
                                                        }
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }))];
                                case 4:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    actOnConvention = function (convention) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(typeof convention === 'function')) return [3 /*break*/, 2];
                                    return [4 /*yield*/, maybeAddResource(convention(this.resourcePath, query, this))];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 5];
                                case 2:
                                    if (!exports.conventions[convention]) return [3 /*break*/, 4];
                                    return [4 /*yield*/, maybeAddResource(exports.conventions[convention](this.resourcePath, query, this))];
                                case 3:
                                    _a.sent();
                                    return [3 /*break*/, 5];
                                case 4: throw new Error("No default convention named '" + convention + "' found");
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    if (!(typeof query.convention !== 'function' && typeof query.convention !== 'string')) return [3 /*break*/, 3];
                    return [4 /*yield*/, Promise.all(query.convention.map(actOnConvention))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, actOnConvention(query.convention)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    if (!requires.length) {
                        this.callback(undefined, source, sourceMap);
                        return [2 /*return*/];
                    }
                    resourceDir_1 = path.dirname(this.resourcePath);
                    relativeRequires = requires.map(function (r) { return ({ literal: "./" + path.relative(resourceDir_1, r) }); });
                    log("Adding resources to " + this.resourcePath + ": " + relativeRequires.map(function (r) { return r.literal; }).join(', '));
                    return [4 /*yield*/, inject_1.getRequireStrings(relativeRequires, query.addLoadersCallback, this)];
                case 6:
                    requireStrings = _a.sent();
                    inject = requireStrings.map(inject_1.wrapInRequireInclude).join('\n');
                    return [2 /*return*/, inject_1.appendCodeAndCallback(this, source, inject, sourceMap)];
                case 7:
                    e_1 = _a.sent();
                    log(e_1);
                    this.emitError(e_1.message);
                    this.callback(undefined, source, sourceMap);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.default = ConventionLoader;
//# sourceMappingURL=convention-loader.js.map
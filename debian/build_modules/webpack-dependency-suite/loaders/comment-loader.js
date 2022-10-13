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
var loaderUtils = require("loader-utils");
var acorn = require("acorn");
var walk = require("acorn-walk/dist/walk");
var debug = require("debug");
var inject_1 = require("../utils/inject");
var log = debug('comment-loader');
function findLiteralNodesAfterBlockComment(ast, comments, commentRegex) {
    return comments
        .filter(function (comment) { return comment.type === 'Block'; })
        .map(function (commentAst) {
        var value = commentAst.value.trim();
        var match = value.match(commentRegex);
        return { ast: commentAst, match: match };
    })
        .filter(function (commentMatch) { return !!commentMatch.match; })
        .map(function (comment) {
        var result = walk.findNodeAfter(ast, comment.ast.end);
        return {
            commentMatch: comment.match,
            literal: result.node && result.node.type === 'Literal' && typeof result.node.value === 'string' ? result.node.value : ''
        };
    })
        .filter(function (comment) { return !!comment.literal; });
}
exports.findLiteralNodesAfterBlockComment = findLiteralNodesAfterBlockComment;
function CommentLoader(source, sourceMap) {
    return __awaiter(this, void 0, void 0, function () {
        var query, comments, ast, POSSIBLE_AST_OPTIONS, i, commentsAndLiterals, commentOnlyImports, allResources, resourceData, requireStrings, inject, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = Object.assign({}, loaderUtils.parseQuery(this.query));
                    if (this.cacheable) {
                        this.cacheable();
                    }
                    this.async();
                    comments = [];
                    ast = undefined;
                    POSSIBLE_AST_OPTIONS = [{
                            ranges: true,
                            locations: true,
                            ecmaVersion: 2017,
                            sourceType: 'module',
                            onComment: comments
                        }, {
                            ranges: true,
                            locations: true,
                            ecmaVersion: 2017,
                            sourceType: 'script',
                            onComment: comments
                        }];
                    i = POSSIBLE_AST_OPTIONS.length;
                    while (!ast && i--) {
                        try {
                            comments.length = 0;
                            ast = acorn.parse(source, POSSIBLE_AST_OPTIONS[i]);
                        }
                        catch (e) {
                            // ignore the error
                            if (!i) {
                                this.emitError("Error while parsing " + this.resourcePath + ": " + e.message);
                                return [2 /*return*/, this.callback(undefined, source, sourceMap)];
                            }
                        }
                    }
                    commentsAndLiterals = findLiteralNodesAfterBlockComment(ast, comments, /^@import *(@lazy)? *(?:@chunk\(['"`]*([\w-]+)['"`]*\))? *(@lazy)?/)
                        .map(function (cal) { return ({
                        literal: cal.literal,
                        lazy: !!(cal.commentMatch[1] || cal.commentMatch[3]),
                        chunk: cal.commentMatch[2]
                    }); });
                    commentOnlyImports = comments
                        .filter(function (c) { return c.type === 'Block'; })
                        .map(function (c) { return c.value.trim().match(/^@import\([\'"`]*([- \./\w*]+)['"`]\)* *(@lazy)? *(?:@chunk\(['"`]*([\w-]+)['"`]*\))? *(@lazy)?$/); })
                        .filter(function (c) { return !!c; })
                        .map(function (c) { return ({
                        literal: c[1],
                        lazy: !!(c[2] || c[4]),
                        chunk: c[3]
                    }); });
                    if (!commentsAndLiterals.length && !commentOnlyImports.length) {
                        this.callback(undefined, source, sourceMap);
                        return [2 /*return*/];
                    }
                    allResources = commentsAndLiterals.concat(commentOnlyImports);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, inject_1.addBundleLoader(allResources)];
                case 2:
                    resourceData = _a.sent();
                    if (!query.enableGlobbing) return [3 /*break*/, 4];
                    return [4 /*yield*/, inject_1.expandAllRequiresForGlob(resourceData, this)];
                case 3:
                    resourceData = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    resourceData = resourceData.filter(function (r) { return !r.literal.includes("*"); });
                    _a.label = 5;
                case 5:
                    log("Adding resources to " + this.resourcePath + ": " + resourceData.map(function (r) { return r.literal; }).join(', '));
                    return [4 /*yield*/, inject_1.getRequireStrings(resourceData, query.addLoadersCallback, this, query.alwaysUseCommentBundles)];
                case 6:
                    requireStrings = _a.sent();
                    inject = requireStrings.map(inject_1.wrapInRequireInclude).join('\n');
                    inject_1.appendCodeAndCallback(this, source, inject, sourceMap);
                    return [3 /*break*/, 8];
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
exports.default = CommentLoader;
//# sourceMappingURL=comment-loader.js.map

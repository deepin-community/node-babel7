"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./plugins/mapped-module-ids-plugin"));
__export(require("./plugins/rewrite-module-subdirectory-plugin"));
__export(require("./plugins/root-most-resolve-plugin"));
__export(require("./plugins/convention-invalidate-plugin"));
__export(require("./utils"));
__export(require("./utils/inject"));
var comment_loader_1 = require("./loaders/comment-loader");
exports.CommentLoader = comment_loader_1.default;
var convention_loader_1 = require("./loaders/convention-loader");
exports.ConventionLoader = convention_loader_1.default;
exports.conventions = convention_loader_1.conventions;
var html_require_loader_1 = require("./loaders/html-require-loader");
exports.HtmlRequireLoader = html_require_loader_1.default;
var list_based_require_loader_1 = require("./loaders/list-based-require-loader");
exports.ListBasedRequireLoader = list_based_require_loader_1.default;
//# sourceMappingURL=index.js.map
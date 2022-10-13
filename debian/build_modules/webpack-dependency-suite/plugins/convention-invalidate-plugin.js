"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debug = require("debug");
var log = debug('convention-invalidate-plugin');
var ConventionInvalidatePlugin = (function () {
    function ConventionInvalidatePlugin(getInvalidationList) {
        if (getInvalidationList === void 0) { getInvalidationList = exports.differentExtensionTransformer; }
        this.getInvalidationList = getInvalidationList;
    }
    ConventionInvalidatePlugin.prototype.apply = function (compiler) {
        var _this = this;
        compiler.plugin('after-environment', function () {
            compiler.watchFileSystem = new TransformWatchFileSystem(compiler.watchFileSystem, compiler, _this.getInvalidationList);
        });
    };
    return ConventionInvalidatePlugin;
}());
exports.ConventionInvalidatePlugin = ConventionInvalidatePlugin;
var TransformWatchFileSystem = (function () {
    function TransformWatchFileSystem(wfs, compiler, getInvalidationList) {
        this.wfs = wfs;
        this.compiler = compiler;
        this.getInvalidationList = getInvalidationList;
    }
    Object.defineProperty(TransformWatchFileSystem.prototype, "inputFileSystem", {
        // getters mapping to origin:
        get: function () { return this.wfs.inputFileSystem; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TransformWatchFileSystem.prototype, "watcherOptions", {
        get: function () { return this.wfs.watcherOptions; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TransformWatchFileSystem.prototype, "watcher", {
        // needed for ts-loader:
        get: function () { return this.wfs.watcher; },
        enumerable: true,
        configurable: true
    });
    TransformWatchFileSystem.prototype.watch = function (files, dirs, missing, startTime, options, callback, callbackUndelayed) {
        var _this = this;
        this.wfs.watch(files, dirs, missing, startTime, options, function (err, filesModified, dirsModified, missingModified, fileTimestamps, dirTimestamps) {
            if (err)
                return callback(err);
            var watchedPaths = Object.keys(fileTimestamps);
            var pathsToInvalidate = _this.getInvalidationList(filesModified, watchedPaths, _this.compiler);
            pathsToInvalidate.forEach(function (filePath) {
                log("Invalidating: " + filePath);
                fileTimestamps[filePath] = Date.now();
                filesModified.push(filePath);
            });
            callback(err, filesModified, dirsModified, missingModified, fileTimestamps, dirTimestamps);
        }, function (filePath, changeTime) {
            var watchedFiles = _this.watcher.fileWatchers.map(function (watcher) { return watcher.path; });
            var toInvalidate = _this.getInvalidationList([filePath], watchedFiles, _this.compiler);
            toInvalidate.forEach(function (file) { return callbackUndelayed(file, changeTime); });
            callbackUndelayed.call(_this.compiler, filePath, changeTime);
        });
    };
    return TransformWatchFileSystem;
}());
exports.TransformWatchFileSystem = TransformWatchFileSystem;
/**
 * "touch", or invalidate all files of the same same path, but different extension
 */
exports.differentExtensionTransformer = function differentExtensionTransformer(changedPaths, watchedFiles) {
    var pathsToInvalidate = [];
    changedPaths.forEach(function (filePath) {
        var pathWithoutExtension = filePath.replace(/\.[^/.]+$/, '');
        var relatedFiles = watchedFiles
            .filter(function (watchedPath) { return watchedPath.indexOf(pathWithoutExtension) === 0 && watchedPath !== filePath; });
        pathsToInvalidate.push.apply(pathsToInvalidate, relatedFiles);
    });
    return pathsToInvalidate;
};
//# sourceMappingURL=convention-invalidate-plugin.js.map
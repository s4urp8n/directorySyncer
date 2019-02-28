const PATH = require('path');
const CONFIG = require('./config');
const FUNCTIONS = require('./functions');

module.exports = {
    Project: function (name) {

        this.checkpoints = [];
        this.name = name;
        this.outPath = PATH.join(CONFIG.workingDir, name, CONFIG.outDirName);
        this.releasePath = PATH.join(CONFIG.releaseDir, name);

        this.isOutPathEmpty = function () {
            if (FUNCTIONS.isExists(this.outPath)) {
                return FUNCTIONS.isEmptyDirectory(this.outPath);
            }
            return true;
        };
        this.isReleasePathEmpty = function () {
            if (FUNCTIONS.isExists(this.outPath)) {
                return FUNCTIONS.isEmptyDirectory(this.outPath);
            }
            return true;
        };
        this.getWorkingHash = function () {
            return FUNCTIONS.md5Dir(this.outPath);
        };
        this.getReleaseHash = function () {
            return FUNCTIONS.md5Dir(this.releasePath);
        };
        this.checkpoint = function () {
            this.checkpoints.push(this.getWorkingHash());
        };
        this.isChanging = function () {
            if (this.checkpoints.length >= 2) {
                var preLast = this.checkpoints[this.checkpoints.length - 2];
                var last = this.checkpoints[this.checkpoints.length - 1];
                if (last == preLast) {
                    return false;
                }
            }
            return true;
        };
        this.isMoveMode = function () {
            return !!CONFIG.move;
        };
        this.getWorkingFiles = function () {

            var that = this;
            //files in output dir
            var files = FUNCTIONS.getDirectoryContentRecursive(this.outPath);
            //map files to release files (change path according to release dir)
            var releaseFiles = files.map(function (path) {
                return that.releasePath + path.substring(that.outPath.length);
            });

            return {
                files: files,
                releaseFiles: releaseFiles
            };
        };
        this.syncCopy = function () {
            console.log('[' + this.name + '] syncing in COPY mode...');
            if (this.getWorkingHash() == this.getReleaseHash()) {
                console.log('[' + this.name + '] already sync');
            } else {

                var workingFiles = this.getWorkingFiles();

                for (var i in workingFiles.files) {
                    var source = workingFiles.files[i];
                    var destination = workingFiles.releaseFiles[i];
                    console.log('[' + this.name + '] copy [' + source + '] ===> [' + destination + ']');
                    FUNCTIONS.copyFile(source, destination);
                }
            }
        };
        this.syncMove = function () {
            console.log('[' + this.name + '] syncing in MOVE mode...');
            var workingFiles = this.getWorkingFiles();

            for (var i in workingFiles.files) {
                var source = workingFiles.files[i];
                var destination = workingFiles.releaseFiles[i];
                console.log('[' + this.name + '] move [' + source + '] ===> [' + destination + ']');
                FUNCTIONS.copyFile(source, destination);
                FUNCTIONS.removePath(source);
            }
        };
        this.sync = function () {
            if (!this.isOutPathEmpty()) {
                this.checkpoint();
                if (!this.isChanging()) {
                    FUNCTIONS.createDirectoryIfNotExists(this.releasePath);
                    this.isMoveMode()
                        ? this.syncMove()
                        : this.syncCopy();
                }
            }
        };

        return this;
    }
}

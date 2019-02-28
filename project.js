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
        this.isChanged = function () {
            if (this.checkpoints.length >= 2) {
                var preLast = this.checkpoints[this.checkpoints.length - 2];
                var last = this.checkpoints[this.checkpoints.length - 1];
                if (last == preLast) {
                    return false;
                }
            }
            return true;
        };
        this.syncDirs = function () {
            FUNCTIONS.createDirectoryIfNotExists(this.releasePath);

        };
        this.sync = function () {
            if (!this.isOutPathEmpty()) {
                this.checkpoint();
            }

            if (!this.isChanged()) {
                console.log('[' + this.name + '] syncing...');
                this.syncDirs();
            }
        };

        return this;
    }
}

const FS = require('fs');
const PATH = require('path');
const MD5DIR = require('md5-dir');

module.exports = {
    createDirectoryIfNotExists: function (path) {
        if (!FS.existsSync(path)) {
            FS.mkdirSync(path, {recursive: true});
        }
    },
    isExists: function (path) {
        return FS.existsSync(path);
    },
    isFile: function (path) {
        return FS.statSync(path).isFile();
    },
    isDirectory: function (path) {
        return FS.statSync(path).isDirectory();
    },
    isEmptyDirectory: function (path) {
        return this.getDirectoryContentRecursive(path).length == 0;
    },
    copyFile: function (source, destination) {
        this.createDirectoryIfNotExists(PATH.dirname(destination));
        if (this.isFile(source)) {
            FS.copyFileSync(source, destination);
        }
    },
    removePath: function (path) {
        var that = this;
        if (FS.existsSync(path)) {
            if (FS.statSync(path).isFile()) {
                FS.unlinkSync(path);
            } else {
                FS.readdirSync(path).forEach(function (file, index) {
                    var curPath = PATH.join(path, file);
                    if (FS.statSync(curPath).isDirectory()) {
                        that.removePath(curPath);
                    } else {
                        FS.unlinkSync(curPath);
                    }
                });
                FS.rmdirSync(path);
            }
        }
    },
    getDirectoryContent: function (path) {
        if (this.isFile(path)) {
            return [path];
        }
        return FS.readdirSync(path).map(function (value) {
            return PATH.join(path, value);
        });
    },
    getDirectoryContentRecursive: function (path) {
        var content = this.getDirectoryContent(path);
        for (var i in content) {
            if (this.isDirectory(content[i])) {
                content = content.concat(this.getDirectoryContentRecursive(content[i]));
            }
        }

        var basedirs = content.filter(function (path) {
            return FS.statSync(path).isFile();
        }).map(function (path) {
            return PATH.dirname(path);
        });

        content = content.filter(function (path) {
            var exists = basedirs.indexOf(path) > -1;
            return !exists;
        });

        return content;
    },
    md5Dir: function (path) {
        return MD5DIR.sync(path);
    },
    getProjectsNames: function (path) {
        return this.getDirectoryContent(path).filter(function (path) {
            return FS.statSync(path).isDirectory();
        }).map(function (path) {
            return PATH.basename(path);
        });
    },
    isObjectPropExists: function (obj, prop) {
        for (var i in obj) {
            if (i == prop) {
                return true;
            }
        }
        return false;
    }
}

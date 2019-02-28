const CONFIG = require('./config');
const FUNCTIONS = require('./functions');
const PROJECT = require('./project');

var projects = {};

function sync() {
    updateProjects();
    syncProjects();
}

function updateProjects() {
    FUNCTIONS.createDirectoryIfNotExists(CONFIG.workingDir);
    FUNCTIONS.createDirectoryIfNotExists(CONFIG.releaseDir);
    FUNCTIONS.getProjectsNames(CONFIG.workingDir).forEach(function (projectName) {
        if (!FUNCTIONS.isObjectPropExists(projects, projectName)) {
            projects[projectName] = new PROJECT.Project(projectName);
            console.log(projectName + ' initialized');
        }
    });
}

function syncProjects() {
    for (let i in projects) {
        projects[i].sync();
    }
}

sync();
setInterval(sync, CONFIG.checkIntervalSeconds * 500);


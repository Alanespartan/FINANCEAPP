const fs = require("fs");
const path = require("path");
const normalizePath = require("normalize-path");

const { newStringRegex } = require("tsc-alias/dist/utils/import-path-resolver");

/** @typedef {{path: string, absPath: string, configFile: string, config: any}} IProjectReference */

let cachedConfig = undefined;
/** @type {IProjectReference[]} */
let referencedProjects = [];

/** @param {{path: string}} refobj */
function resolveProjectReference(refobj) {
    const absPath = path.resolve(refobj);
    const configFile = path.join(absPath, "tsconfig.json");
    return {
        path: refobj.path,
        absPath,
        configFile,
        config: JSON.parse(fs.readFileSync(configFile, "utf-8"))
    }
}

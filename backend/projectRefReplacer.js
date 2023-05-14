const fs = require("fs");
const path = require("path");
const normalizePath = require("normalize-path");

const { newStringRegex } = require("tsc-alias/dist/utils/import-path-resolver.js");

/** @typedef {{path: string, absPath: string, configFile: string, config: any}} IProjectReference */

let cachedConfig = undefined;
/** @type {IProjectReference[]} */
let referencedProjects = [];

/** @param {{path: string}} refobj */
function resolveProjectReference(refobj) {
    const absPath = path.resolve(refobj.path);
    const configFile = path.join(absPath, "tsconfig.json");
    return {
        path: refobj.path,
        absPath,
        configFile,
        config: JSON.parse(fs.readFileSync(configFile, "utf-8"))
    }
}

/**
 * @param {import("tsc-alias/dist/interfaces").Alias} alias 
 * @returns {[IProjectReference, import("tsc-alias/dist/interfaces").AliasPath]}
 */
function findProjectReference(alias) {
    for(const pr of referencedProjects) {
        for(const pathobj of alias.paths) {
            if(pathobj.path.startsWith(pr.path)) { return [ pr, pathobj ] }
        }
    }
    return undefined;
}

/**
 * @param {import("tsc-alias").AliasReplacerArguments} options
 */
exports.default = function projectRefReplacer({ orig, file, config }) {
    if(!cachedConfig) {
        cachedConfig = JSON.parse(fs.readFileSync(config.configFile, "utf-8"));
        if(cachedConfig.references) {
            referencedProjects = cachedConfig.references.map(resolveProjectReference);
        }
    }

    const requiredModule = orig.match(newStringRegex())?.groups?.path;
    config.output.assert(
        typeof requiredModule == "string",
        `Unexpected import statement pattern ${orig}`
    );

    const alias = config.aliasTrie.search(requiredModule);

    if(!alias || !alias.shouldPrefixMatchWildly) { return orig; }

    const isAlias = requiredModule.startsWith(alias.prefix) && requiredModule !== alias.prefix;
    if(!isAlias) return orig;
    const pref = findProjectReference(alias);
    if(!pref) return orig;
    const [ projectRef, aliasPathObj ] = pref;

    const relPrefix = aliasPathObj.path + projectRef.config.compilerOptions.outDir + "/";
    const relPath = requiredModule.replace(alias.prefix, relPrefix);

    const absoluteAliasPath = config.pathCache.getAbsoluteAliasPath(
        config.baseUrl,
        relPath
    );

    if(!config.pathCache.existsResolvedAlias(normalizePath(absoluteAliasPath))) {
        return orig;
    }

    let relativeAliasPath = normalizePath(
        path.relative(path.dirname(file), absoluteAliasPath)
    );

    if(!relativeAliasPath.startsWith(".")) { 
        relativeAliasPath = "./" + relativeAliasPath;
    }

    const index = orig.indexOf(alias.prefix);
    const newImportScript =
        orig.substring(0, index) +
        relativeAliasPath +
        orig.substring(index + requiredModule.length);
    
    const modulePath = newImportScript.match(newStringRegex()).groups.path;
    return newImportScript.replace(modulePath, normalizePath(modulePath));
}
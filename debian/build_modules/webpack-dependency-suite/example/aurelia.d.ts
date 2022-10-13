import { PathWithLoaders, RequireData } from '../typings/definitions';
/**
 * 1. load MAIN package.json
 * 2. get the aurelia resources: packageJson.aurelia && packageJson.aurelia.build && packageJson.aurelia.build.resources
 * 3. glob all resources
 * 4. resolve each resource in the context of MAIN package.json
 * 5. foreach files, match with resolved resources and replace loaders or return what was there
 *
 * @param {Object} packageJson
 * @param {string} rootDir
 * @param {Array<RequireData>} files
 * @param {Webpack.Core.LoaderContext} loaderInstance
 * @returns {Promise<Array<PathWithLoaders>>}
 */
export declare function addLoadersMethod(rootDir: string, files: Array<RequireData>, loaderInstance: Webpack.Core.LoaderContext): Promise<Array<PathWithLoaders>>;

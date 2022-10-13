/**
 * @description Uses the root-most package instead of a nested node_modules package.
 * Useful when doing 'npm link' for nested dependencies,
 * so you can be sure all packages use the right copy of the given module.
 */
export declare class RootMostResolvePlugin {
    context: string;
    force: boolean | undefined;
    overwriteInvalidSemVer: boolean;
    constructor(context: string, force?: boolean | undefined, overwriteInvalidSemVer?: boolean);
    apply(resolver: EnhancedResolve.Resolver): void;
}

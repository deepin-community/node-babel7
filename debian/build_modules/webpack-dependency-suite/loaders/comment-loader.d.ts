/// <reference types="acorn" />
/// <reference types="source-map" />
import * as SourceMap from 'source-map';
import * as acorn from 'acorn';
import * as ESTree from 'estree';
export declare function findLiteralNodesAfterBlockComment(ast: ESTree.Program, comments: Array<acorn.Comment>, commentRegex: RegExp): {
    commentMatch: RegExpMatchArray | null;
    literal: string;
}[];
export default function CommentLoader(this: Webpack.Core.LoaderContext, source: string, sourceMap?: SourceMap.RawSourceMap): Promise<void>;

/// <reference types="source-map" />
import { ConventionFunction } from '../typings/definitions';
import * as SourceMap from 'source-map';
export declare const conventions: {
    [convention: string]: ConventionFunction;
};
export default function ConventionLoader(this: Webpack.Core.LoaderContext, source: string, sourceMap?: SourceMap.RawSourceMap): Promise<string | undefined>;

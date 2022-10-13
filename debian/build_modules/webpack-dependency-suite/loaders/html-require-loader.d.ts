/// <reference types="source-map" />
import { HtmlRequireOptions } from '../typings/definitions';
import * as SourceMap from 'source-map';
export declare const htmlRequireDefaults: HtmlRequireOptions;
export default function HtmlRequireLoader(this: Webpack.Core.LoaderContext, pureHtml: string, sourceMap?: SourceMap.RawSourceMap): string | Promise<string | void | undefined>;

/**
* @module Sol/gfx
*/

import canvas           from "./canvas/index.js";
import webgl            from "./webgl/index.js";
import GfxManager       from "./GfxManager.js";
import GfxManagerConfig from "./GfxManagerConfig.js";
import Renderer         from "./Renderer.js";

/**
* Stores utilities, classes, and resources for graphics.
* @namespace Sol.gfx
* @memberof Sol
* @type {Object<string, any>}
*/
const gfx = {
	canvas:           canvas,
	webgl:            webgl,
	GfxManager:       GfxManager,
	GfxManagerConfig: GfxManagerConfig,
	Renderer:         Renderer
};

export default gfx;

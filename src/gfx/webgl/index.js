/**
* @module Sol/gfx/webgl
*/

import shaderSrc     from "./shaderSrc/index.js";
import util          from "./util/index.js";
import MVPMatrix     from "./MVPMatrix.js";
import Program       from "./Program.js";
import TextureCache  from "./TextureCache.js";
import VertBuffer    from "./VertBuffer.js";
import WebGLRenderer from "./WebGLRenderer.js";

/**
* Stores utilities, classes, and resources for the WebGL renderer.
* @namespace Sol.gfx.webgl
* @memberof Sol.gfx
* @type {Object<string, function|Object<string, any>>}
*/
const webgl = {
	shaderSrc:     shaderSrc,
	util:          util,
	MVPMatrix:     MVPMatrix,
	Program:       Program,
	TextureCache:  TextureCache,
	VertBuffer:    VertBuffer,
	WebGLRenderer: WebGLRenderer
};

export default webgl;

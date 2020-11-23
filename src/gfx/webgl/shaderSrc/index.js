/**
* @module Sol/gfx/webgl/shaderSrc
*/

// Imported using rollup-plugin-glsl:
import mainFrag from "./mainFrag.fs.glsl";
import mainVert from "./mainVert.vs.glsl";

/**
* Stores the minified source code for WebGL shaders.
* @namespace Sol.gfx.webgl.shaderSrc
* @memberof Sol.gfx.webgl
* @type {Object<string, string>}
*/
const shaderSrc = {
	mainFrag: mainFrag,
	mainVert: mainVert
};

export default shaderSrc;

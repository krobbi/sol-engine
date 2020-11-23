/**
* @module Sol/gfx/webgl/util
*/

import createShader from "./createShader.js";
import parseShader  from "./parseShader.js";

/**
* Stores utilities for the WebGL renderer.
* @namespace Sol.gfx.webgl.util
* @memberof Sol.gfx.webgl
* @type {Object<string, function>}
*/
const util = {
	createShader: createShader,
	parseShader:  parseShader
};

export default util;

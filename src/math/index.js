/**
* @module Sol/math
*/

import clamp       from "./clamp.js";
import OrthoMatrix from "./OrthoMatrix.js";

/**
* Stores mathematical utilities.
* @namespace Sol.math
* @memberof Sol
* @type {Object<string, function>}
*/
const math = {
	clamp:       clamp,
	OrthoMatrix: OrthoMatrix
};

export default math;

/**
* @module Sol/math/clamp
*/

/**
* Limit a value between a minimum and maximum boundary.
* @function clamp
* @memberof Sol.math
* @param {number} value - The value to clamp.
* @param {number} min - The minimum boundary to clamp the value to.
* @param {number} max - The maximum boundary to clamp the value to.
* @returns {number} The value clamped to the minimum and maximum boundary.
*/
function clamp(value, min, max){
	return Math.min(max, Math.max(min, value));
}

export default clamp;

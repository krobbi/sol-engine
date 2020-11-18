/**
* @module Sol/core/util/getCompatible
*/

/**
* Get whether Sol is compatible with the user's environment.
* @function getCompatible
* @memberof Sol.core.util
* @returns {boolean} Whether Sol is compatible with the user's environment.
*/
function getCompatible(){
	/**
	* An array of the typeof values of required constructs to run Sol.
	* @type {string[]}
	* @ignore
	*/
	const requiredTypes = [
		typeof document,
		typeof document.readyState,
		typeof setInterval,
		typeof clearInterval,
		typeof requestAnimationFrame
	];

	for(let type of requiredTypes){
		if(type == "undefined"){
			return false;
		}
	}

	return true;
}

export default getCompatible;

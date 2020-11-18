/**
* @module Sol/util/object/shallowExtend
*/

/**
* Extend an object with the properties of another object while ignoring objects,
* arrays, functions and classes.
* @function shallowExtend
* @memberof Sol.util.object
* @param {Object<string, any>} target - The target object to shallowly extend.
* @param {Object<string, any>} src - The source object to shallowly extend the
* target object with.
*/
function shallowExtend(target, src){
	for(let key in src){
		if(
			src.hasOwnProperty(key) &&
			typeof src[key] != "object" && typeof src[key] != "function"
		){
			target[key] = src[key];
		}
	}
}

export default shallowExtend;

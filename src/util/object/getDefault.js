/**
* @module Sol/util/object/getDefault
*/

/**
* Get a value from an object by its key and return a default value if the key
* does not exist in the object.
* @function getDefault
* @memberof Sol.util.object
* @param {Object<string, any>} src - The source object to get the value from.
* @param {string} key - The key of the value to get from the source object.
* @param {any} defaultValue - The default value to return if the key does not
* exist in the source object.
* @returns {any} The value of the key in the source object, or the default value
* if the key does not exist in the source object.
*/
function getDefault(src, key, defaultValue){
	return src.hasOwnProperty(key) ? src[key] : defaultValue;
}

export default getDefault;

/**
* @module Sol/util/object
*/

import shallowExtend from "./shallowExtend.js";
import getDefault    from "./getDefault.js";

/**
* Stores global utilities for objects.
* @namespace Sol.util.object
* @memberof Sol.util
* @type {Object<string, function>}
*/
const object = {
	shallowExtend: shallowExtend,
	getDefault:    getDefault
};

export default object;

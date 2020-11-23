/**
* @module Sol/util
*/

import object from "./object/index.js";
import noop   from "./noop.js";

/**
* Stores global utilities for Sol.
* @namespace Sol.util
* @memberof Sol
* @type {Object<string, function|Object<string, function>>}
*/
const util = {
	object: object,
	noop:   noop
};

export default util;

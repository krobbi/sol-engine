/**
* @module Sol/core/util
*/

import consoleSplash from "./consoleSplash.js";
import getCompatible from "./getCompatible.js";

/**
* Stores utilities for creating and running a game.
* @namespace Sol.core.util
* @memberof Sol.core
* @type {Object<string, function>}
*/
const util = {
	consoleSplash: consoleSplash,
	getCompatible: getCompatible
};

export default util;

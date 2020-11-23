/**
* @module Sol/json
*/

import JsonFile    from "./JsonFile.js";
import JsonManager from "./JsonManager.js";

/**
* Stores classes for JSON files.
* @namespace Sol.json
* @memberof Sol
* @type {Object<string, function>}
*/
const json = {
	JsonFile:    JsonFile,
	JsonManager: JsonManager
};

export default json;

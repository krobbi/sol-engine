/**
* @module Sol/key
*/

import KeyManager       from "./KeyManager.js";
import KeyManagerConfig from "./KeyManagerConfig.js";

/**
* Stores classes for keyboard input.
* @namespace Sol.key
* @memberof Sol
* @type {Object<string, function>}
*/
const key = {
	KeyManager:       KeyManager,
	KeyManagerConfig: KeyManagerConfig
};

export default key;

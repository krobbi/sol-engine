/**
* @module Sol/key/KeyManagerConfig
*/

import getDefault from "../util/object/getDefault.js";

/**
* Keyboard input manager configuration.
* @class KeyManagerConfig
* @memberof Sol.key
* @classdesc Stores configuration for a keyboard input manager.
*/
class KeyManagerConfig {
	/**
	* Create the keyboard input manager configuration.
	* @param {Object<string, any>=} options - An options object to merge into the
	* keyboard input manager configuration.
	*/
	constructor(options = {}){
		/**
		* Whether to listen for keyboard input.
		* @type {boolean}
		* @default true
		*/
		this.enabled = !!getDefault(options, "enabled", true);
	}
}

export default KeyManagerConfig;

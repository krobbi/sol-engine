/**
* @module Sol/core/Config
* @typedef {GfxManagerConfig}   Sol.gfx.GfxManagerConfig
* @typedef {KeyManagerConfig}   Sol.key.KeyManagerConfig
* @typedef {SceneManagerConfig} Sol.scene.SceneManagerConfig
*/

import GfxManagerConfig   from "../gfx/GfxManagerConfig.js";
import KeyManagerConfig   from "../key/KeyManagerConfig.js";
import SceneManagerConfig from "../scene/SceneManagerConfig.js";

import getDefault from "../util/object/getDefault.js";

/**
* Game instance configuration.
* @class Config
* @memberof Sol.core
* @classdesc Stores configuration for a game instance.
*/
class Config {
	/**
	* Create the game instance configuration.
	* @param {Object<string, any>=} options - An options object to merge into the
	* game instance configuration.
	*/
	constructor(options = {}){
		/**
		* Whether to start the game once the game instance is created.
		* @type {boolean}
		* @default false
		*/
		this.autoStart = !!getDefault(options, "autoStart", false);

		/**
		* Stores configuration for the graphics manager.
		* @type {Sol.gfx.GfxManagerConfig}
		*/
		this.gfx = new GfxManagerConfig(getDefault(options, "gfx", {}));

		/**
		* Stores configuration for the keyboard input manager.
		* @type {Sol.key.KeyManagerConfig}
		*/
		this.key = new KeyManagerConfig(getDefault(options, "key", {}));

		/**
		* Stores configuration for the scene manager.
		* @type {Sol.scene.SceneManagerConfig}
		*/
		this.scene = new SceneManagerConfig(getDefault(options, "scene", {}));
	}
}

export default Config;

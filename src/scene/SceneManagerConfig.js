/**
* @module Sol/scene/SceneManagerConfig
* @typedef {import("./Scene.js").default} Sol.Scene
*/

import getDefault from "../util/object/getDefault.js";

/**
* Scene manager configuration.
* @class SceneManagerConfig
* @memberof Sol.scene
* @classdesc Stores configuration for a scene manager.
*/
class SceneManagerConfig {
	/**
	* Create the scene manager configuration.
	* @param {Object<string, any>=} options - An options object to merge into the
	* scene manager configuration.
	*/
	constructor(options = {}){
		/**
		* The key of the scene to start the game on.
		* @type {string}
		* @default "main"
		*/
		this.main = getDefault(options, "main", "main");

		/**
		* A dictionary of scene keys and scene class names.
		* @type {Object<string, function(new:Sol.Scene)>}
		* @default {}
		*/
		this.scenes = getDefault(options, "scenes", {});
	}
}

export default SceneManagerConfig;

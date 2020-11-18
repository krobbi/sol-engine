/**
* @module Sol/scene
*/

import SceneManager       from "./SceneManager.js";
import SceneManagerConfig from "./SceneManagerConfig.js";

/**
* Stores classes for scenes.
* @namespace Sol.scene
* @memberof Sol
* @type {Object<string, function>}
*/
const scene = {
	SceneManager:       SceneManager,
	SceneManagerConfig: SceneManagerConfig
};

export default scene;

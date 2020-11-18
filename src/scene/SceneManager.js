/**
* @module Sol/scene/SceneManager
* @typedef {import("../core/Game.js").default} Sol.Game
* @typedef {import("./SceneManagerConfig.js").default}
* Sol.scene.SceneManagerConfig
* @typedef {Scene} Sol.Scene
*/

import Scene from "./Scene.js";

/**
* Scene manager.
* @class SceneManager
* @memberof Sol.scene
* @classdesc Manages scenes for a game instance.
*/
class SceneManager {
	/**
	* Create the scene manager.
	* @param {Sol.Game} game - The game instance that this scene manager belongs
	* to.
	* @param {Sol.scene.SceneManagerConfig} config - The scene manager
	* configuration.
	*/
	constructor(game, config){
		/**
		* The game instance that this scene manager belongs to.
		* @private
		* @type {Sol.Game}
		*/
		this._game = game;

		/**
		* The scene manager configuration.
		* @private
		* @type {Sol.scene.SceneManagerConfig}
		*/
		this._config = config;

		/**
		* The key of the default scene.
		* @private
		* @constant
		* @type {string}
		* @default "__sol_default__"
		*/
		this._KEY_DEFAULT = "__sol_default__";

		/**
		* The key of the active scene.
		* @private
		* @type {string}
		*/
		this._keyActive = this._KEY_DEFAULT;

		/**
		* The key of the next scene.
		* @private
		* @type {string}
		*/
		this._keyNext = this._KEY_DEFAULT;

		/**
		* Whether the active scene is changing.
		* @private
		* @type {boolean}
		*/
		this._changing = false;

		/**
		* A dictionary of scene keys and scenes.
		* @private
		* @type {Object<string, Sol.Scene>}
		*/
		this._scenes = {};

		this._scenes[this._KEY_DEFAULT] = new Scene();
	}

	/**
	* Get whether a key exists.
	* @param {string} key - The key of the scene to test.
	* @returns {boolean} Whether the scene exists.
	*/
	has(key){
		return key != this._KEY_DEFAULT && key in this._scenes;
	}

	/**
	* Create a scene.
	* @param {string} key - The key to give the scene.
	* @param {function(new:Sol.Scene)} scene - The class name of the scene.
	* @returns {boolean} Whether the scene was created successfully.
	*/
	create(key, scene){
		if(key == this._KEY_DEFAULT){
			return false;
		}

		this.destroy(key);
		this._scenes[key] = new scene();
		this._scenes[key].onCreate(this._game);
		return true;
	}

	/**
	* Change the active scene.
	* @param {string} key - The key of the scene to change the active scene to.
	* @returns {boolean} Whether the active scene was changed successfully.
	*/
	change(key){
		if(!this.has(key)){
			return false;
		}

		this._keyNext  = key;
		this._changing = true;
		return true;
	}

	/**
	* Reload the active scene.
	* @returns {boolean} Whether the active scene was reloaded successfully.
	*/
	reload(){
		return this.change(this._keyActive);
	}

	/**
	* Destroy a scene.
	* @param {string} key - The key of the scene to destroy.
	* @returns {boolean} Whether the scene existed before being destroyed.
	*/
	destroy(key){
		if(!this.has(key)){
			return false;
		}

		this._scenes[key].onDestroy(this._game);

		if(key == this._keyActive || (this._changing && key == this._keyNext)){
			this._keyActive = this._KEY_DEFAULT;
			this._keyNext   = this._KEY_DEFAULT;
			this._changing  = false;
		}

		delete this._scenes[key];
		return true;
	}

	/**
	* Runs when the game starts. Creates scenes and changes the active scene to
	* the main scene.
	*/
	onStart(){
		for(let key in this._config.scenes){
			this.create(key, this._config.scenes[key]);
		}

		this.change(this._config.main);
	}

	/**
	* Runs on every game tick. Changes and ticks the active scene.
	*/
	onTick(){
		if(this._changing){
			this._scenes[this._keyActive].onExit(this._game);
			this._keyActive = this._keyNext;
			this._changing  = false;
			this._scenes[this._keyActive].onEnter(this._game);
		}

		this._scenes[this._keyActive].onTick(this._game);
	}

	/**
	* Runs on every frame. Draws the active scene.
	*/
	onDraw(){
		this._scenes[this._keyActive].onDraw(this._game);
	}

	/**
	* Runs when the game stops. Destroys all available scenes.
	*/
	onStop(){
		for(let key in this._scenes){
			this.destroy(key);
		}
	}

	/**
	* Get a scene.
	* @param {string} key - The key of the scene to get.
	* @returns {?Sol.Scene} A scene. Returns null if the scene does not exist.
	*/
	get(key){
		return this.has(key) ? this._scenes[key] : null;
	}

	/**
	* The key of the active scene.
	* @readonly
	* @returns {string}
	*/
	get key(){ return this._keyActive; }

	/**
	* Whether the active scene is changing.
	* @readonly
	* @returns {boolean}
	*/
	get changing(){ return this._changing; }

	/**
	* The active scene.
	* @readonly
	* @returns {Sol.Scene}
	*/
	get active(){ return this._scenes[this._keyActive]; }

	/**
	* An array of all available scene keys.
	* @readonly
	* @returns {string[]}
	*/
	get keys(){
		/**
		* An array of all available scene keys.
		* @type {string[]}
		* @ignore
		*/
		const keys = [];

		for(let key in this._scenes){
			if(this.has(key)){
				keys.push(key);
			}
		}

		return keys;
	}
}

export default SceneManager;

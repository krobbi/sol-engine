/**
* @module Sol/core/Game
* @typedef {Config}         Sol.core.Config
* @typedef {Loop}           Sol.core.Loop
* @typedef {GfxManager}     Sol.gfx.GfxManager
* @typedef {JsonManager}    Sol.json.JsonManager
* @typedef {KeyManager}     Sol.key.KeyManager
* @typedef {SceneManager}   Sol.scene.SceneManager
* @typedef {TextureManager} Sol.texture.TextureManager
* @typedef {TimeManager}    Sol.time.TimeManager
* @typedef {Loader}         Sol.asset.Loader
*/

import Config         from "./Config.js";
import Loop           from "./Loop.js";
import GfxManager     from "../gfx/GfxManager.js";
import JsonManager    from "../json/JsonManager.js";
import KeyManager     from "../key/KeyManager.js";
import SceneManager   from "../scene/SceneManager.js";
import TextureManager from "../texture/TextureManager.js";
import TimeManager    from "../time/TimeManager.js";
import Loader         from "../asset/Loader.js";

/**
* Game instance.
* @class Game
* @memberof Sol
* @classdesc Stores the API for running a game.
*/
class Game {
	/**
	* Create the game instance.
	* @param {Object<string, any>=} options - An options object to merge into the
	* game instance configuration.
	*/
	constructor(options = {}){
		/**
		* Stores configuration for the game instance.
		* @type {Sol.core.Config}
		* @ignore
		*/
		const config = new Config(options);

		/**
		* Runs a game loop and calls events in the managers of the game instance.
		* @private
		* @type {Sol.core.Loop}
		*/
		this._loop = new Loop(this);

		/**
		* Manages graphics for the game instance.
		* @type {Sol.gfx.GfxManager}
		*/
		this.gfx = new GfxManager(this, config.gfx);

		/**
		* Manages JSON files for the game instance.
		* @type {Sol.json.JsonManager}
		*/
		this.json = new JsonManager();

		/**
		* Manages keyboard input for the game instance.
		* @type {Sol.key.KeyManager}
		*/
		this.key = new KeyManager(config.key);

		/**
		* Manages scenes for the game instance.
		* @type {Sol.scene.SceneManager}
		*/
		this.scene = new SceneManager(this, config.scene);

		/**
		* Manages textures for the game instance.
		* @type {Sol.texture.TextureManager}
		*/
		this.texture = new TextureManager(this);

		/**
		* Manages timing for the game instance.
		* @type {Sol.time.TimeManager}
		*/
		this.time = new TimeManager();

		/**
		* Keeps track of the loaded state of lists of assets.
		* @type {Sol.asset.Loader}
		*/
		this.loader = new Loader(this);

		if(config.autoStart){
			this.start();
		}
	}

	/**
	* Start the game if it is not running.
	* @returns {boolean} Whether the game was started successfully from a stopped
	* state.
	*/
	start(){
		return this._loop.start();
	}

	/**
	* Stop the game if it is running and start the game.
	* @returns {boolean} Whether the game was restarted successfully.
	*/
	restart(){
		return this._loop.restart();
	}

	/**
	* Stop the game if it is running.
	* @returns {boolean} Whether the game was stopped from a running state.
	*/
	stop(){
		return this._loop.stop();
	}

	/**
	* Whether the game is running.
	* @readonly
	* @returns {boolean}
	*/
	get running(){ return this._loop.running; }

	/**
	* The time since the previous game tick in seconds.
	* @readonly
	* @returns {number}
	*/
	get delta(){ return this.time.delta; }

	/**
	* The number of frames per second.
	* @readonly
	* @returns {number}
	*/
	get fps(){ return this.time.fps; }
}

export default Game;

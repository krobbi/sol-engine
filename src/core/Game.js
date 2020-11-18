/**
* @module Sol/core/Game
* @typedef {Config}       Sol.core.Config
* @typedef {Loop}         Sol.core.Loop
* @typedef {SceneManager} Sol.scene.SceneManager
* @typedef {TimeManager}  Sol.time.TimeManager
*/

import Config       from "./Config.js";
import Loop         from "./Loop.js";
import SceneManager from "../scene/SceneManager.js";
import TimeManager  from "../time/TimeManager.js";

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
		* Manages scenes for the game instance.
		* @type {Sol.scene.SceneManager}
		*/
		this.scene = new SceneManager(this, config.scene);

		/**
		* Manages timing for the game instance.
		* @type {Sol.time.TimeManager}
		*/
		this.time = new TimeManager();

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

/**
* @module Sol/core/Loop
* @typedef {import("./Game.js").default} Sol.Game
*/

import consoleSplash from "./util/consoleSplash.js";
import getCompatible from "./util/getCompatible.js";

/**
* Game loop.
* @class Loop
* @memberof Sol.core
* @classdesc Runs a game loop and calls events in the managers of a game
* instance.
*/
class Loop {
	/**
	* Create the game loop.
	* @param {Sol.Game} game - The game instance that this game loop belongs to.
	*/
	constructor(game){
		/**
		* The game instance that this game loop belongs to.
		* @private
		* @type {Sol.Game}
		*/
		this._game = game;

		/**
		* Whether the game loop is starting. The game loop should not start if it is
		* already starting.
		* @private
		* @type {boolean}
		*/
		this._starting = false;

		/**
		* Whether the game loop is running. The game loop should not start if the
		* game loop is running and not stopping.
		* @private
		* @type {boolean}
		*/
		this._running = false;

		/**
		* Whether the game loop should be stopped.
		* @private
		* @type {boolean}
		*/
		this._stopping = false;

		/**
		* The time at the start of the current game loop step in milliseconds.
		* @private
		* @type {number}
		*/
		this._timeNow = 0;

		/**
		* The time at the start of the previous game loop step in milliseconds.
		* @private
		* @type {number}
		*/
		this._timeLast = 0;

		/**
		* The time since the previous game loop step in seconds.
		* @private
		* @type {number}
		*/
		this._delta = 0;
	}

	/**
	* Run one step of the game loop. Calculates delta time and continually
	* requests new animation frames until the game loop is stopping.
	* @private
	*/
	_step(){
		this._delta = (this._timeNow - this._timeLast) / 1000;
		this._onUpdate();

		if(this._stopping){
			this._onStop();
			this._running  = false;
			this._stopping = false;
			return;
		}

		requestAnimationFrame(
			/**
			* Run another game loop.
			* @param {DOMHighResTimeStamp} time - The current time in milliseconds.
			* @ignore
			*/
			time => {
				this._timeLast = this._timeNow;
				this._timeNow  = time;
				this._step();
			}
		);
	}

	/**
	* Start the game loop if it is not running.
	* @returns {boolean} Whether the game loop was started successfully from a
	* stopped state.
	*/
	start(){
		if(
			this._starting || (this._running && !this._stopping) || !getCompatible()
		){
			return false;
		}

		this._starting = true;

		/**
		* An interval to wait for the game loop to stop and the document to load.
		* @type {number}
		* @ignore
		*/
		const waitInterval = setInterval(
			/**
			* Runs periodically until the game loop stops and the document loads.
			* @ignore
			*/
			() => {
				if(!this._running && document.readyState == "complete"){
					clearInterval(waitInterval);
					this._running  = true;
					this._stopping = false;
					this._onStart();
					this._starting = false;
					this._step();
				}
			}
		);

		return true;
	}

	/**
	* Stop the game loop if it is running and start the game loop.
	* @returns {boolean} Whether the game loop was restarted successfully.
	*/
	restart(){
		this.stop();
		return this.start();
	}

	/**
	* Stop the game loop if it is running.
	* @returns {boolean} Whether the game loop was stopped from a running state.
	*/
	stop(){
		if(this._running && !this._stopping){
			this._stopping = true;
			return true;
		}

		return false;
	}

	/**
	* Runs when the game loop starts.
	* @private
	*/
	_onStart(){
		consoleSplash();
		this._game.scene.onStart();
	}

	/**
	* Runs on every step of the game loop.
	* @private
	*/
	_onUpdate(){
		this._game.time.onPreTick(this._delta);
		this._game.scene.onTick();
		this._game.scene.onDraw();
	}

	/**
	* Runs when the game loop stops.
	* @private
	*/
	_onStop(){
		this._game.scene.onStop();
	}

	/**
	* Whether the game loop is running.
	* @readonly
	* @returns {boolean}
	*/
	get running(){ return this._running; }
}

export default Loop;

/**
* @module Sol/time/TimeManager
*/

import clamp from "../math/clamp.js";

/**
* Timing manager.
* @class TimeManager
* @memberof Sol.time
* @classdesc Manages timing for a game instance.
*/
class TimeManager {
	/**
	* Create the timing manager.
	*/
	constructor(){
		/**
		* The minimum allowed delta time for a game tick.
		* @private
		* @constant
		* @type {number}
		* @default 0.00001
		*/
		this._MIN_DELTA = 0.00001;

		/**
		* The maximum allowed delta time for a game tick.
		* @private
		* @constant
		* @type {number}
		* @default 1
		*/
		this._MAX_DELTA = 1;

		/**
		* The time since the previous game tick in seconds.
		* @private
		* @type {number}
		*/
		this._delta = 1;

		/**
		* The number of frames per second.
		* @private
		* @type {number}
		*/
		this._fps = 1;
	}

	/**
	* Runs before every game tick. Updates the delta time and frames per second.
	* @param {number} delta - The raw delta time.
	*/
	onPreTick(delta){
		this._delta = clamp(delta, this._MIN_DELTA, this._MAX_DELTA);
		this._fps   = 1 / delta;
	}

	/**
	* The time since the previous game tick in seconds.
	* @readonly
	* @returns {number}
	*/
	get delta(){ return this._delta; }

	/**
	* The number of frames per second.
	* @readonly
	* @returns {number}
	*/
	get fps(){ return this._fps; }
}

export default TimeManager;

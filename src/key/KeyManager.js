/**
* @module Sol/key/KeyManager
* @typedef {import("./KeyManagerConfig.js").default} Sol.key.KeyManagerConfig
* @typedef {EventHandler}                            Sol.dom.EventHandler
*/

import EventHandler from "../dom/EventHandler.js";

/**
* Keyboard input manager.
* @class KeyManager
* @memberof Sol.key
* @classdesc Manages keyboard input for a game instance.
*/
class KeyManager {
	/**
	* Create the keyboard input manager.
	* @param {Sol.key.KeyManagerConfig} config - The keyboard input manager
	* configuration.
	*/
	constructor(config){
		/**
		* Whether to listen for keyboard input.
		* @private
		* @type {boolean}
		*/
		this._enabled = config.enabled;

		/**
		* A dictionary of key codes and whether the keys are currently pressed.
		* @private
		* @type {Object<string, boolean>}
		*/
		this._keys = {};

		/**
		* A dictionary of key codes and whether the keys were pressed at the start
		* of the current game tick.
		* @private
		* @type {Object<string, boolean>}
		*/
		this._keysNow = {};

		/**
		* A dictionary of key codes and whether the keys were pressed at the start
		* of the previous game tick.
		* @private
		* @type {Object<string, boolean>}
		*/
		this._keysLast = {};

		/**
		* An event handler for keydown events.
		* @private
		* @type {Sol.dom.EventHandler}
		*/
		this._keydownHandler = new EventHandler(document, "keydown",
			/**
			* Runs when a keydown event occurs.
			* @param {KeyboardEvent} event - A keyboard event.
			* @ignore
			*/
			event => this._onKeydown(event), {
				once: false,
				passive: true
			}
		);

		/**
		* An event handler for keyup events.
		* @private
		* @type {Sol.dom.EventHandler}
		*/
		this._keyupHandler = new EventHandler(document, "keyup",
			/**
			* Runs when a keyup event occurs.
			* @param {KeyboardEvent} event - A keyboard event.
			* @ignore
			*/
			event => this._onKeyup(event), {
				once: false,
				passive: true
			}
		);
	}

	/**
	* Get whether a key was pressed on this game tick.
	* @param {string} code - The code of the key to test.
	* @returns {boolean} Whether the key was pressed on this game tick.
	*/
	down(code){
		return !!this._keysNow[code] && !this._keysLast[code];
	}

	/**
	* Get whether a key is being held.
	* @param {string} code - The code of the key to test.
	* @returns {boolean} Whether the key is being held.
	*/
	held(code){
		return !!this._keysNow[code];
	}

	/**
	* Get whether a key was released on this game tick.
	* @param {string} code - The code of the key to test.
	* @returns {boolean} Whether the key was released on this game tick.
	*/
	up(code){
		return !this._keysNow[code] && !!this._keysLast[code];
	}

	/**
	* Runs when a keydown event occurs.
	* @private
	* @param {KeyboardEvent} event - A keyboard event.
	*/
	_onKeydown(event){
		this._keys[event.code] = true;
	}

	/**
	* Runs when a keyup event occurs.
	* @private
	* @param {KeyboardEvent} event - A keyboard event.
	*/
	_onKeyup(event){
		this._keys[event.code] = false;
	}

	/**
	* Runs when the game starts. Starts the event handlers.
	*/
	onStart(){
		if(this._enabled){
			this._keydownHandler.start();
			this._keyupHandler.start();
		}
	}

	/**
	* Runs before every game tick. Updates keyboard input.
	*/
	onPreTick(){
		Object.assign(this._keysLast, this._keysNow);
		Object.assign(this._keysNow, this._keys);
	}

	/**
	* Runs when the game stops. Stops the event handlers and clears keyboard
	* input.
	*/
	onStop(){
		this._keydownHandler.stop();
		this._keyupHandler.stop();

		for(let code in this._keys){
			this._keysLast[code] = this._keysNow[code] = this._keys[code] = false;
		}
	}
}

export default KeyManager;

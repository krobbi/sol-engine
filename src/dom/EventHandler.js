/**
* @module Sol/dom/EventHandler
*/

import noop from "../util/noop.js";

/**
* DOM event handler.
* @class EventHandler
* @memberof Sol.dom
* @classdesc Handles an event listener for a set of DOM events and event
* targets.
*/
class EventHandler {
	/**
	* Create the DOM event handler.
	* @param {EventTarget|EventTarget[]} targets - An event target or array of
	* event targets to listen for events on.
	* @param {string|string[]} types - An event type or array of event types to
	* listen for on the event targets.
	* @param {EventListenerOrEventListenerObject} listener - The event listener to
	* call when any of the event targets receive any of the event types.
	* @param {boolean|EventListenerOptions} options - The options to give the
	* event listener.
	*/
	constructor(targets, types, listener, options){
		/**
		* An array of event targets to listen for events on.
		* @private
		* @type {EventTarget[]}
		*/
		this._targets = Array.isArray(targets) ? targets : [targets];

		/**
		* An array of event types to listen for on the event targets.
		* @private
		* @type {string[]}
		*/
		this._types = Array.isArray(types) ? types : [types];

		/**
		* The event listener to call when any of the event targets recieve any of
		* the event types.
		* @private
		* @type {EventListenerOrEventListenerObject}
		*/
		this._listener = listener;

		/**
		* The options to give the event listener.
		* @private
		* @type {boolean|EventListenerOptions}
		*/
		this._options = options;

		/**
		* Whether the event handler is active.
		* @private
		* @type {boolean}
		*/
		this._active = false;
	}

	/**
	* Start the event handler.
	* @returns {boolean} Whether the event handler was started from a stopped
	* state.
	*/
	start(){
		if(this._active || this._targets.length == 0 || this._types.length == 0){
			return false;
		}

		for(let target of this._targets){
			for(let type of this._types){
				target.addEventListener(type, this._listener, this._options);
			}
		}

		this._active = true;
		return true;
	}

	/**
	* Stop the event handler.
	* @returns {boolean} Whether the event handler was stopped from a running
	* state.
	*/
	stop(){
		if(!this._active){
			return false;
		}

		for(let target of this._targets){
			for(let type of this._types){
				target.removeEventListener(type, this._listener, this._options);
			}
		}

		this._active = false;
		return true;
	}

	/**
	* Destroy the event handler.
	*/
	destroy(){
		this.stop();
		this._targets  = [];
		this._types    = [];
		this._listener = noop;
		this._options  = false;
	}

	/**
	* Whether the event handler is active.
	* @readonly
	* @returns {boolean}
	*/
	get active(){ return this._active; }
}

export default EventHandler;

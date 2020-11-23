/**
* @module Sol/json/JsonManager
* @typedef {JsonFile} Sol.json.JsonFile
*/

import JsonFile from "./JsonFile.js";

import noop from "../util/noop.js";

/**
* JSON file manager.
* @class JsonManager
* @memberof Sol.json
* @classdesc Manages JSON files for a game instance.
*/
class JsonManager {
	/**
	* Create the JSON file manager.
	*/
	constructor(){
		/**
		* A dictionary of JSON file keys and JSON files.
		* @private
		* @type {Object<string, Sol.json.JsonFile>}
		*/
		this._json = {};
	}

	/**
	* Get whether a JSON file exists.
	* @param {string} key - The key of the JSON file to test.
	* @returns {boolean} Whether the JSON file exists.
	*/
	has(key){
		return key in this._json;
	}

	/**
	* Create a JSON file.
	* @param {string} src - The source of the JSON file.
	* @returns {Sol.json.JsonFile} The created JSON file.
	*/
	create(src){
		/**
		* The created JSON file.
		* @type {Sol.json.JsonFile}
		* @ignore
		*/
		const jsonFile = new JsonFile();

		/**
		* A HTTP request to load the JSON file with.
		* @type {XMLHttpRequest}
		* @ignore
		*/
		const xhr = new XMLHttpRequest();

		/**
		* Runs when the ready state of the HTTP request changes.
		* @ignore
		*/
		xhr.onreadystatechange = () => {
			if(xhr.readyState == XMLHttpRequest.DONE){
				xhr.onreadystatechange = noop;

				if(xhr.status >= 200 && xhr.status <= 299){
					try{
						jsonFile.data = JSON.parse(xhr.responseText);
					}catch(e){
						console.warn(`Failed to parse ${src}: ${e}`);
						jsonFile.missing = true;
					}
				}else{
					console.warn(
						`Missing JSON: ${src}\nHTTP ${xhr.status}: ${xhr.statusText}`
					);
					jsonFile.missing = true;
				}

				jsonFile.loaded = true;
			}
		};

		xhr.open("GET", src);
		xhr.send(null);
		return jsonFile;
	}

	/**
	* Load a JSON file.
	* @param {string} key - The key to give the JSON file.
	* @param {string} src - The source of the JSON file.
	* @returns {Sol.json.JsonFile} The loaded JSON file.
	*/
	load(key, src){
		this.unload(key);
		this._json[key] = this.create(src);
		return this._json[key];
	}

	/**
	* Unload a JSON file.
	* @param {string} key - The key of the JSON file to unload.
	* @returns {boolean} Whether the JSON file existed before being unloaded.
	*/
	unload(key){
		if(!this.has(key)){
			return false;
		}

		/**
		* The JSON file to unload.
		* @type {Sol.json.JsonFile}
		* @ignore
		*/
		const jsonFile = this._json[key];

		jsonFile.loaded  = false;
		jsonFile.missing = false;
		jsonFile.data    = {};
		delete this._json[key];
		return true;
	}

	/**
	* Unload all JSON files.
	*/
	unloadAll(){
		for(let key in this._json){
			this.unload(key);
		}
	}

	/**
	* Runs when the game stops. Unloads all JSON files.
	*/
	onStop(){
		this.unloadAll();
	}

	/**
	* Get a JSON file.
	* @param {string} key - The key of the JSON file to get.
	* @returns {?Sol.json.JsonFile} A JSON file. Returns null if the JSON file
	* does not exist.
	*/
	get(key){
		return this.has(key) ? this._json[key] : null;
	}

	/**
	* Get the data of a JSON file.
	* @param {string} key - The key of the JSON file to get the data of.
	* @returns {any|any[]|Object<string, any>} The data of the JSON file. Returns
	* an empty object if the JSON file does not exist.
	*/
	getData(key){
		return this.has(key) ? this._json[key].data : {};
	}
}

export default JsonManager;

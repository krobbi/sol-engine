/**
* @module Sol/json/JsonFile
* @typedef {Asset} Sol.asset.Asset
*/

import Asset from "../asset/Asset.js";

/**
* JSON file.
* @class JsonFile
* @extends Sol.asset.Asset
* @memberof Sol.json
* @classdesc Stores the data of a JSON file.
*/
class JsonFile extends Asset {
	/**
	* Create the JSON file.
	*/
	constructor(){
		super();

		/**
		* The data of the JSON file.
		* @type {any|any[]|Object<string, any>}
		*/
		this.data = {};
	}
}

export default JsonFile;

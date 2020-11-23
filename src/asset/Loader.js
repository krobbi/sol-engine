/**
* @module Sol/asset/Loader
* @typedef {import("../core/Game.js").default} Sol.Game
* @typedef {import("./Asset.js").default}      Sol.asset.Asset
*/

import getDefault from "../util/object/getDefault.js";

/**
* Asset loader.
* @class Loader
* @memberof Sol.asset
* @classdesc Keeps track of the loaded state of lists of assets.
*/
class Loader {
	/**
	* Create the asset loader.
	* @param {Sol.Game} game - The game instance that this asset loader belongs
	* to.
	*/
	constructor(game){
		/**
		* The game instance that this asset loader belongs to.
		* @private
		* @type {Sol.Game}
		*/
		this._game = game;

		/**
		* A dictionary of asset list keys and asset lists.
		* @private
		* @type {Object<string, Sol.asset.Asset[]>}
		*/
		this._assets = {};
	}

	/**
	* Create an asset list if it does not exist and return the asset list.
	* @private
	* @param {string} listKey - The key of the asset list to allocate.
	* @returns {Sol.asset.Asset[]} The allocated asset list.
	*/
	_allocate(listKey){
		if(!(listKey in this._assets)){
			this._assets[listKey] = [];
		}

		return this._assets[listKey];
	}

	/**
	* Load loader data.
	* @param {string} listKey - The key of the asset list to load the loader data
	* in.
	* @param {Object<string, any>} data - The loader data to load.
	*/
	load(listKey, data){
		/**
		* A dictionary of JSON file keys and JSON file loader data.
		* @type {Object<string, Object<string, string>>}
		* @default {}
		* @ignore
		*/
		const jsonFiles = getDefault(data, "json", {});

		/**
		* A dictionary of texture keys and texture loader data.
		* @type {Object<string, Object<string, number|string>>}
		* @default {}
		* @ignore
		*/
		const textures = getDefault(data, "textures", {});

		// Load JSON files:
		for(let key in jsonFiles){
			/**
			* JSON file loader data.
			* @type {Object<string, string>}
			* @ignore
			*/
			const jsonFile = jsonFiles[key];

			/**
			* The source of the JSON file.
			* @type {string}
			* @default "data:application/json,{}"
			* @ignore
			*/
			const src = getDefault(jsonFile, "src", "data:application/json,{}");

			this.loadJsonFile(listKey, key, src);
		}

		// Load textures:
		for(let key in textures){
			/**
			* Texture loader data.
			* @type {Object<string, number|string>}
			* @ignore
			*/
			const texture = textures[key];

			/**
			* The source of the texture image.
			* @type {string}
			* @default ""
			* @ignore
			*/
			const src = getDefault(texture, "src", "");

			/**
			* The expected width of the texture.
			* @type {number}
			* @default 0
			* @ignore
			*/
			const width = getDefault(texture, "width", 0);

			/**
			* The expected height of the texture.
			* @type {number}
			* @default 0
			* @ignore
			*/
			const height = getDefault(texture, "height", 0);

			this.loadTexture(listKey, key, src, width, height);
		}
	}

	/**
	* Load a JSON file.
	* @param {string} listKey - The key of the asset list to load the JSON file
	* in.
	* @param {string} key - The key to give the JSON file.
	* @param {string} src - The source of the JSON file.
	*/
	loadJsonFile(listKey, key, src){
		/**
		* The asset list to load the JSON file in.
		* @type {Sol.asset.Asset[]}
		* @ignore
		*/
		const list = this._allocate(listKey);

		list.push(this._game.json.load(key, src));
	}

	/**
	* Load a texture.
	* @param {string} listKey - The key of the asset list to load the texture in.
	* @param {string} key - The key to give the texture.
	* @param {string} src - The source of the texture image.
	* @param {number=} width - The expected width of the texture. Use 0 for the
	* width of the texture image.
	* @param {number=} height - The expected height of the texture. Use 0 for the
	* height of the texture image.
	*/
	loadTexture(listKey, key, src, width = 0, height = 0){
		/**
		* The asset list to load the texture in.
		* @type {Sol.asset.Asset[]}
		* @ignore
		*/
		const list = this._allocate(listKey);

		list.push(this._game.texture.load(key, src, width, height));
	}

	/**
	* Get the loading progress of an asset list.
	* @param {string} listKey - The key of the asset list to get the loading
	* progress of.
	* @returns {number} The loading progress of the asset list between 0 and 1.
	*/
	progress(listKey){
		/**
		* The asset list to get the loading progress of.
		* @type {Sol.asset.Asset[]}
		* @ignore
		*/
		const list = this._allocate(listKey);

		/**
		* The count of loaded assets in the asset list.
		* @type {number}
		* @ignore
		*/
		let count = 0;

		for(let asset of list){
			if(asset.loaded){
				count++;
			}
		}

		if(count >= list.length){
			this._assets[listKey] = [];
			return 1;
		}

		return count / list.length;
	}

	/**
	* Get the loading completion status of an asset list.
	* @param {string} listKey - The key of the asset list to get the loading
	* completion status of.
	* @returns {boolean} The loading completion status of the asset list.
	*/
	complete(listKey){
		return this.progress(listKey) >= 1;
	}

	/**
	* Runs when the game stops. Clears all asset lists.
	*/
	onStop(){
		for(let key in this._assets){
			this._assets[key] = [];
		}
	}
}

export default Loader;

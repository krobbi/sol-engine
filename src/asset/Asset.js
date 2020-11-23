/**
* @module Sol/asset/Asset
*/

/**
* Asset base.
* @abstract
* @class Asset
* @memberof Sol.asset
* @classdesc Stores the interface for assets. A resource with a loaded flag and
* a missing flag. Used for storing data for resources that need to be loaded
* asynchronously. The loaded and missing flags are accessed through getters and
* setters so that they can be made to rely on the state of sub-assets. Assets
* should not include methods and instead have public properties that are set
* directly by some external manager. This reduces the memory footprint of assets
* and allows the data of a single type of asset to be populated in many ways.
*/
class Asset {
	/**
	* Create the asset base.
	*/
	constructor(){
		/**
		* Whether the asset is loaded.
		* @protected
		* @type {boolean}
		*/
		this._loaded = false;

		/**
		* Whether the asset is missing.
		* @protected
		* @type {boolean}
		*/
		this._missing = false;
	}

	/**
	* Whether the asset is loaded.
	* @virtual
	* @param {boolean} value
	*/
	set loaded(value){ this._loaded = value; }

	/**
	* Whether the asset is missing.
	* @virtual
	* @param {boolean} value
	*/
	set missing(value){ this._missing = value; }

	/**
	* Whether the asset is loaded.
	* @virtual
	* @returns {boolean}
	*/
	get loaded(){ return this._loaded; }

	/**
	* Whether the asset is missing.
	* @virtual
	* @returns {boolean}
	*/
	get missing(){ return this._missing; }
}

export default Asset;

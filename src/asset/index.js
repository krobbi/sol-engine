/**
* @module Sol/asset
*/

import Asset  from "./Asset.js";
import Loader from "./Loader.js";

/**
* Stores classes for assets.
* @namespace Sol.asset
* @memberof Sol
* @type {Object<string, function>}
*/
const asset = {
	Asset:  Asset,
	Loader: Loader
};

export default asset;

/**
* @module Sol/core
*/

import util   from "./util/index.js";
import Config from "./Config.js";
import Loop   from "./Loop.js";

/**
* Stores utilities and classes for creating and running a game.
* @namespace Sol.core
* @memberof Sol
* @type {Object<string, function|Object<string, function>>}
*/
const core = {
	util:   util,
	Config: Config,
	Loop:   Loop
};

export default core;

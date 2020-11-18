/**
* @module Sol
*/

import core  from "./core/index.js";
import math  from "./math/index.js";
import scene from "./scene/index.js";
import time  from "./time/index.js";
import util  from "./util/index.js";
import Game  from "./core/Game.js";
import Scene from "./scene/Scene.js";

import CONST         from "./CONST.js";
import shallowExtend from "./util/object/shallowExtend.js";

/**
* The global namespace for Sol.
* @global
* @namespace Sol
* @mixes Sol.CONST
* @type {Object<string, any>}
*/
const Sol = {
	core:  core,
	math:  math,
	scene: scene,
	time:  time,
	util:  util,
	Game:  Game,
	Scene: Scene
};

shallowExtend(Sol, CONST);

export default Sol;

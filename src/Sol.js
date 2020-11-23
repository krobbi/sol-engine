/**
* @module Sol
*/

import asset   from "./asset/index.js";
import core    from "./core/index.js";
import dom     from "./dom/index.js";
import gfx     from "./gfx/index.js";
import json    from "./json/index.js";
import key     from "./key/index.js";
import math    from "./math/index.js";
import scene   from "./scene/index.js";
import texture from "./texture/index.js";
import time    from "./time/index.js";
import util    from "./util/index.js";
import Game    from "./core/Game.js";
import Scene   from "./scene/Scene.js";

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
	asset:   asset,
	core:    core,
	dom:     dom,
	gfx:     gfx,
	json:    json,
	key:     key,
	math:    math,
	scene:   scene,
	texture: texture,
	time:    time,
	util:    util,
	Game:    Game,
	Scene:   Scene
};

shallowExtend(Sol, CONST);

export default Sol;

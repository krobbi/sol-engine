/**
* @module Sol/core/util/consoleSplash
* @typedef {import("../Game.js").default} Sol.Game
*/

import CONST from "../../CONST.js";

/**
* Display a splash message for a game instance. in the console.
* @function consoleSplash
* @memberof Sol.core.util
* @param {Sol.Game} game - The game instance to create the splash message for.
*/
function consoleSplash(game){
	/**
	* The name of the renderer that is being used.
	* @type {string}
	* @ignore
	*/
	let rendererName;

	switch(game.gfx.renderer.type){
		case CONST.NONE:
			rendererName = "No";
			break;
		case CONST.WEBGL:
			rendererName = "WebGL";
			break;
		case CONST.CANVAS:
			rendererName = "Canvas";
			break;
		default:
			rendererName = "Unknown";
			break;
	}

	console.log(
		[
			`%c Sol v${CONST.VERSION} `,
			`%c ${rendererName} renderer `,
			` ${CONST.LICENSE} License - ${CONST.LICENSE_URL} `,
			` Copyright (c) ${CONST.COPYRIGHT_YEAR} ${CONST.COPYRIGHT} `
		].join("\n"),
		"background:#080808;color:#f77f00;font-size:medium;font-weight:bold;",
		"background:#080808;color:#f3d180;"
	);
}

export default consoleSplash;

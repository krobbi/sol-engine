/**
* @module Sol/core/util/consoleSplash
*/

import CONST from "../../CONST.js";

/**
* Display a splash message in the console.
* @function consoleSplash
* @memberof Sol.core.util
*/
function consoleSplash(){
	console.log(
		[
			`%c Sol v${CONST.VERSION} `,
			`%c ${CONST.LICENSE} License - ${CONST.LICENSE_URL} `,
			` Copyright (c) ${CONST.COPYRIGHT_YEAR} ${CONST.COPYRIGHT} `
		].join("\n"),
		"background:#080808;color:#f77f00;font-size:medium;font-weight:bold;",
		"background:#080808;color:#f3d180;"
	);
}

export default consoleSplash;

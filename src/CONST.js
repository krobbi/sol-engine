/**
* @module Sol/CONST
*/

/**
* Global constants to extend Sol with.
* @global
* @mixin Sol.CONST
* @type {Object<string, number|string>}
*/
const CONST = {
	/**
	* The semantic version tag for this version of Sol.
	* @constant
	* @type {string}
	* @name Sol.VERSION
	* @default "0.2.0"
	*/
	VERSION: "0.2.0",

	/**
	* The type of license for this version of Sol.
	* @constant
	* @type {string}
	* @name Sol.LICENSE
	* @default "MIT"
	*/
	LICENSE: "MIT",

	/**
	* The URL of the license for this version of Sol.
	* @constant
	* @type {string}
	* @name Sol.LICENSE_URL
	* @default "https://krobbi.github.io/license/2020/mit.txt"
	*/
	LICENSE_URL: "https://krobbi.github.io/license/2020/mit.txt",

	/**
	* The copyright holder for this version of Sol.
	* @constant
	* @type {string}
	* @name Sol.COPYRIGHT
	* @default "Chris Roberts"
	*/
	COPYRIGHT: "Chris Roberts",

	/**
	* The copyright year for this version of Sol.
	* @constant
	* @type {string}
	* @name Sol.COPYRIGHT_YEAR
	* @default "2020"
	*/
	COPYRIGHT_YEAR: "2020",

	/**
	* An enumerated value representing "none".
	* @constant
	* @type {number}
	* @name Sol.NONE
	* @default 0
	*/
	NONE: 0,

	/**
	* An enumerated value representing the WebGL renderer.
	* @constant
	* @type {number}
	* @name Sol.WEBGL
	* @default 1
	*/
	WEBGL: 1,

	/**
	* An enumerated value representing the canvas renderer.
	* @constant
	* @type {number}
	* @name Sol.CANVAS
	* @default 2
	*/
	CANVAS: 2
};

export default CONST;
